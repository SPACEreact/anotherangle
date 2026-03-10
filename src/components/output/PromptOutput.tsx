import { useState, useEffect } from 'react';
import { Copy, Check, Edit3, X, Wand2, Layers } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { usePromptGenerator } from '../../hooks/usePromptGenerator';
import { copyToClipboard } from '../../utils/promptBuilder';
import { parsePrompt } from '../../services/aiService';
import type { ParsedPrompt } from '../../services/aiService';
import { useUIStore } from '../../stores/useUIStore';
import { useSceneStore } from '../../stores/useSceneStore';
import { useCameraStore } from '../../stores/useCameraStore';
import { useCompositionStore } from '../../stores/useCompositionStore';
import { useLocationStore } from '../../stores/useLocationStore';
import { useLightingStore } from '../../stores/useLightingStore';
import { motion } from 'framer-motion';

export function PromptOutput() {
    const { prompt, segments } = usePromptGenerator();
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPrompt, setEditedPrompt] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [showSegments, setShowSegments] = useState(false);
    const addNotification = useUIStore((state) => state.addNotification);

    // Store setters
    const updateScene = useSceneStore((state) => state.updateScene);
    const setAngles = useCameraStore((state) => state.setAngles);
    const setForeground = useCompositionStore((state) => state.setForeground);
    const setMidground = useCompositionStore((state) => state.setMidground);
    const setBackground = useCompositionStore((state) => state.setBackground);
    const setCustomLocation = useLocationStore((state) => state.setCustomLocation);
    const setTimeOfDay = useLocationStore((state) => state.setTimeOfDay);
    const setWeather = useLocationStore((state) => state.setWeather);
    const setSeason = useLocationStore((state) => state.setSeason);
    const setEra = useLocationStore((state) => state.setEra);
    const setVolumetric = useLightingStore((state) => state.setVolumetric);

    useEffect(() => {
        const handleCopyEvent = async () => {
            const success = await copyToClipboard(prompt);
            if (success) {
                setCopied(true);
                addNotification('Prompt copied to clipboard!', 'success');
                setTimeout(() => setCopied(false), 2000);
            } else {
                addNotification('Failed to copy prompt', 'error');
            }
        };

        window.addEventListener('copy-prompt', handleCopyEvent);
        return () => window.removeEventListener('copy-prompt', handleCopyEvent);
    }, [prompt, addNotification]);

    const handleCopy = async () => {
        const textToCopy = isEditing ? editedPrompt : prompt;
        const success = await copyToClipboard(textToCopy);
        if (success) {
            setCopied(true);
            addNotification('Prompt copied to clipboard!', 'success');
            setTimeout(() => setCopied(false), 2000);
        } else {
            addNotification('Failed to copy prompt', 'error');
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Exiting edit mode - reset
            setEditedPrompt('');
        } else {
            // Entering edit mode
            setEditedPrompt(prompt);
        }
        setIsEditing(!isEditing);
    };

    const applyParsedSettings = (parsed: ParsedPrompt) => {
        // Apply subject and setting
        if (parsed.subject || parsed.setting || parsed.lens || parsed.aspectRatio || parsed.filmStock) {
            updateScene({
                ...(parsed.subject && { subject: parsed.subject }),
                ...(parsed.setting && { setting: parsed.setting }),
                ...(parsed.lens && { lens: parsed.lens }),
                ...(parsed.aspectRatio && { aspectRatio: parsed.aspectRatio }),
                ...(parsed.filmStock && { filmStock: parsed.filmStock }),
            });
        }

        // Apply camera angles
        if (parsed.cameraAngle) {
            setAngles({
                ...(parsed.cameraAngle.azimuth !== undefined && { azimuth: parsed.cameraAngle.azimuth }),
                ...(parsed.cameraAngle.elevation !== undefined && { elevation: parsed.cameraAngle.elevation }),
                ...(parsed.cameraAngle.roll !== undefined && { roll: parsed.cameraAngle.roll }),
            });
        }

        // Apply composition
        if (parsed.composition) {
            if (parsed.composition.foreground) {
                setForeground({ description: parsed.composition.foreground });
            }
            if (parsed.composition.midground) {
                setMidground({ description: parsed.composition.midground });
            }
            if (parsed.composition.background) {
                setBackground({ description: parsed.composition.background });
            }
        }

        // Apply location settings
        if (parsed.location) {
            if (parsed.location.placeName) setCustomLocation(parsed.location.placeName);
            if (parsed.location.timeOfDay) setTimeOfDay(parsed.location.timeOfDay);
            if (parsed.location.weather) setWeather(parsed.location.weather);
            if (parsed.location.season) setSeason(parsed.location.season);
            if (parsed.location.era) setEra(parsed.location.era);
        }

        // Apply lighting
        if (parsed.lighting?.volumetric !== undefined) {
            setVolumetric(parsed.lighting.volumetric);
        }
    };

    const handleParseAndApply = async () => {
        if (!editedPrompt.trim()) {
            addNotification('Please enter a prompt to parse', 'error');
            return;
        }

        setIsParsing(true);
        try {
            const parsed = await parsePrompt(editedPrompt);
            if (parsed) {
                applyParsedSettings(parsed);
                addNotification('Settings extracted and applied!', 'success');
                setIsEditing(false);
                setEditedPrompt('');
            } else {
                addNotification('Could not parse prompt. Try again.', 'error');
            }
        } catch {
            addNotification('Failed to parse prompt', 'error');
        }
        setIsParsing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col h-full"
        >
            <Card className="flex-1 flex flex-col border-2 border-primary-500/30">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                        {isEditing ? 'Edit Prompt' : 'Final Prompt'}
                    </span>
                    <div className="flex items-center gap-2">
                        {!isEditing && (
                            <button
                                onClick={() => setShowSegments(!showSegments)}
                                className={`text-[10px] flex items-center gap-1 transition-colors ${showSegments ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                                title="Toggle segment view"
                            >
                                <Layers size={10} />
                                {showSegments ? 'Segments' : 'Plain'}
                            </button>
                        )}
                        <button
                            onClick={handleEditToggle}
                            className="text-[10px] flex items-center gap-1 text-primary-400 hover:text-primary-300 transition-colors"
                        >
                            {isEditing ? (
                                <>
                                    <X size={10} />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <Edit3 size={10} />
                                    Edit
                                </>
                            )}
                        </button>
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-slow"></div>
                    </div>
                </div>

                {/* Prompt Display / Editor */}
                {isEditing ? (
                    <textarea
                        value={editedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        className="flex-1 p-3 rounded-lg font-mono text-xs leading-5 overflow-y-auto custom-scrollbar mb-4 bg-zinc-950 text-primary-100 border border-primary-500/50 focus:border-primary-400 focus:outline-none resize-none"
                        placeholder="Enter or paste a prompt to reverse-parse and populate settings..."
                    />
                ) : showSegments ? (
                    <div className="flex-1 p-3 rounded-lg text-xs leading-6 overflow-y-auto custom-scrollbar mb-4 bg-zinc-950 border border-zinc-800">
                        {segments.map((seg, i) => {
                            const colorMap: Record<string, string> = {
                                reference: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                                subject: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                                composition: 'bg-green-500/20 text-green-300 border-green-500/30',
                                location: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                                lighting: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
                                camera: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
                                quality: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
                                parameters: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
                            };
                            const labelMap: Record<string, string> = {
                                reference: 'REF',
                                subject: 'SUBJ',
                                composition: 'COMP',
                                location: 'LOC',
                                lighting: 'LIGHT',
                                camera: 'CAM',
                                quality: 'QUAL',
                                parameters: 'PARAM',
                            };
                            return (
                                <span key={i} className={`inline-block mr-1 mb-1 px-1.5 py-0.5 rounded border ${colorMap[seg.type] || 'bg-zinc-800 text-zinc-400'}`}>
                                    <span className="text-[8px] font-bold uppercase opacity-60 mr-1">{labelMap[seg.type] || seg.type}</span>
                                    {seg.content}
                                </span>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex-1 p-3 rounded-lg font-mono text-xs leading-5 overflow-y-auto custom-scrollbar mb-4 bg-zinc-950 text-primary-100 border border-zinc-800">
                        {prompt}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    {isEditing ? (
                        <Button
                            onClick={handleParseAndApply}
                            variant="primary"
                            size="lg"
                            fullWidth
                            disabled={isParsing}
                        >
                            {isParsing ? (
                                <>
                                    <Wand2 size={18} className="animate-spin" />
                                    <span>PARSING...</span>
                                </>
                            ) : (
                                <>
                                    <Wand2 size={18} />
                                    <span>APPLY FROM PROMPT</span>
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleCopy}
                            variant={copied ? 'success' : 'primary'}
                            size="lg"
                            fullWidth
                        >
                            {copied ? (
                                <>
                                    <Check size={18} />
                                    <span>COPIED</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={18} />
                                    <span>COPY PROMPT</span>
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}
