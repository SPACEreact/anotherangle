import { useState, useRef } from 'react';
import { Layers, ImageIcon, X, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { useSceneStore } from '../../stores/useSceneStore';
import { useCompositionStore } from '../../stores/useCompositionStore';
import { useCameraStore } from '../../stores/useCameraStore';
import { useLightingStore } from '../../stores/useLightingStore';
import { analyzeImage } from '../../services/aiService';
import { motion } from 'framer-motion';

export function SubjectPanel() {
    const { subject, setting, charSheet } = useSceneStore();
    const setSubject = useSceneStore((state) => state.setSubject);
    const setSetting = useSceneStore((state) => state.setSetting);
    const setCharSheet = useSceneStore((state) => state.setCharSheet);
    const { setForeground, setMidground, setBackground } = useCompositionStore();
    const setAngles = useCameraStore((state) => state.setAngles);
    const { setVolumetric, setKeyLight, setFillLight, setBackLight } = useLightingStore();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);

    const handleUpload = async (file: File) => {
        // Convert to data URL
        const reader = new FileReader();
        reader.onload = async (e) => {
            const dataUrl = e.target?.result as string;
            if (!dataUrl) return;

            // Set the image
            setCharSheet(dataUrl);

            // Analyze with AI
            setIsAnalyzing(true);
            setAnalysisResult(null);

            try {
                const analysis = await analyzeImage(dataUrl);

                if (analysis) {
                    // Apply analysis to composition layers
                    if (analysis.foreground) setForeground({ description: analysis.foreground });
                    if (analysis.midground) {
                        setMidground({ description: analysis.midground });
                        // Also update the subject with what the AI detected in the main scene area
                        setSubject(analysis.midground);
                    }
                    if (analysis.background) setBackground({ description: analysis.background });
                    if (analysis.location) setSetting(analysis.location);

                    // Apply camera angles if detected
                    if (analysis.cameraAngle) {
                        setAngles({
                            azimuth: analysis.cameraAngle.azimuth,
                            elevation: analysis.cameraAngle.elevation,
                            roll: analysis.cameraAngle.roll,
                        });
                    }

                    // Apply lighting mood from analysis
                    if (analysis.lighting) {
                        const lightingLower = analysis.lighting.toLowerCase();
                        // Detect if volumetric/foggy atmosphere
                        if (lightingLower.includes('fog') || lightingLower.includes('haze') || lightingLower.includes('mist') || lightingLower.includes('volumetric')) {
                            setVolumetric(true);
                        }
                        // Detect warm vs cool key lighting
                        if (lightingLower.includes('warm') || lightingLower.includes('golden') || lightingLower.includes('candle')) {
                            setKeyLight({ color: '#ffaa44' });
                        } else if (lightingLower.includes('cool') || lightingLower.includes('blue') || lightingLower.includes('moonlight')) {
                            setKeyLight({ color: '#88aaff' });
                        }
                        // Detect high contrast / dramatic
                        if (lightingLower.includes('dramatic') || lightingLower.includes('contrast') || lightingLower.includes('chiaroscuro')) {
                            setKeyLight({ intensity: 1.5 });
                            setFillLight({ intensity: 0.2 });
                        }
                        // Detect back/rim lighting
                        if (lightingLower.includes('rim') || lightingLower.includes('backlit') || lightingLower.includes('silhouette')) {
                            setBackLight({ enabled: true, intensity: 1.0 });
                        }
                    }

                    setAnalysisResult(`🎨 ${analysis.mood} mood, ${analysis.lighting}, ${analysis.timeOfDay}`);
                } else {
                    setAnalysisResult('⚠️ Could not analyze image');
                }
            } catch {
                setAnalysisResult('⚠️ Analysis failed');
            }

            setIsAnalyzing(false);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setCharSheet(null);
        setAnalysisResult(null);
        // Reset file input so the same file can be re-uploaded
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
        >
            <Card>
                <CardHeader icon={<Layers size={14} className="text-primary-400" />}>
                    <span className="text-primary-400">Subject & Context</span>
                </CardHeader>

                {/* Subject Input */}
                <div className="space-y-1 mb-4">
                    <label className="text-[10px] font-bold opacity-50 uppercase">Subject</label>
                    <textarea
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full text-sm p-3 rounded-lg resize-none h-20 outline-none transition-all bg-zinc-950 focus:bg-zinc-800 border border-zinc-800 focus:border-primary-500"
                        placeholder="Describe your subject..."
                    />
                </div>

                {/* Setting Input */}
                <div className="space-y-1 mb-4">
                    <label className="text-[10px] font-bold opacity-50 uppercase">Setting</label>
                    <input
                        type="text"
                        value={setting}
                        onChange={(e) => setSetting(e.target.value)}
                        className="w-full text-sm p-3 rounded-lg outline-none transition-all bg-zinc-950 focus:bg-zinc-800 border border-zinc-800 focus:border-primary-500"
                        placeholder="Environment or location..."
                    />
                </div>

                {/* Character Reference Upload */}
                <div className="relative group cursor-pointer border-2 border-dashed rounded-lg h-28 flex items-center justify-center overflow-hidden transition-all border-zinc-700 hover:border-primary-500 bg-zinc-950">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                handleUpload(file);
                                // Reset input value so uploading same file triggers onChange again
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }
                        }}
                    />
                    {charSheet ? (
                        <>
                            <img
                                src={charSheet}
                                alt="Character Reference"
                                className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white text-xs font-bold pointer-events-none">
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="animate-spin mb-1" size={20} />
                                        <span>Analyzing with AI...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={16} className="mb-1 text-purple-400" />
                                        <span>AI Analyzed</span>
                                    </>
                                )}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearImage();
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full z-20 pointer-events-auto"
                            >
                                <X size={12} />
                            </button>
                        </>
                    ) : (
                        <div className="text-center opacity-50">
                            <ImageIcon className="mx-auto mb-1" size={18} />
                            <span className="text-[10px] font-bold uppercase block">Upload Reference Image</span>
                            <span className="text-[9px] text-purple-400">🤖 AI will analyze it</span>
                        </div>
                    )}
                </div>

                {/* Analysis Result */}
                {analysisResult && (
                    <div className="mt-2 p-2 text-[10px] bg-purple-900/20 rounded border border-purple-500/20 text-purple-300">
                        {analysisResult}
                    </div>
                )}
            </Card>
        </motion.div>
    );
}
