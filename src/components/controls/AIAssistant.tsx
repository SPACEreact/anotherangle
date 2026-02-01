import { useState } from 'react';
import { Sparkles, Wand2, Lightbulb, Copy, Check } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { usePromptGenerator } from '../../hooks/usePromptGenerator';
import { enhancePrompt } from '../../services/aiService';
import { copyToClipboard } from '../../utils/promptBuilder';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export function AIAssistant() {
    const { prompt } = usePromptGenerator();
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
    const [tips, setTips] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string>('');

    const handleEnhance = async () => {
        setIsEnhancing(true);
        setError('');
        setEnhancedPrompt('');
        setTips([]);

        try {
            const result = await enhancePrompt(prompt);
            if (result) {
                setEnhancedPrompt(result.enhanced || '');
                setTips(result.tips || []);
            } else {
                setError('AI enhancement unavailable');
            }
        } catch (err) {
            setError('Failed to enhance prompt');
        }

        setIsEnhancing(false);
    };

    const handleCopyEnhanced = async () => {
        if (!enhancedPrompt) return;
        const success = await copyToClipboard(enhancedPrompt);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card className="border border-purple-500/30 bg-gradient-to-br from-purple-900/10 to-zinc-900">
                <CardHeader icon={<Sparkles size={14} className="text-purple-400" />}>
                    <span className="text-purple-400">AI Assistant</span>
                    <span className="ml-2 text-[8px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded uppercase">Gemini</span>
                </CardHeader>

                {/* Enhance Button */}
                <button
                    onClick={handleEnhance}
                    disabled={isEnhancing}
                    className={clsx(
                        'w-full py-2 rounded flex items-center justify-center gap-2 font-bold text-sm transition-all',
                        isEnhancing
                            ? 'bg-purple-500/30 text-purple-300'
                            : 'bg-purple-500 hover:bg-purple-600 text-white'
                    )}
                >
                    <Wand2 size={16} className={clsx(isEnhancing && 'animate-spin')} />
                    {isEnhancing ? 'Enhancing...' : 'Enhance Prompt with AI'}
                </button>

                {/* Error */}
                {error && (
                    <div className="mt-2 p-2 text-[10px] bg-red-900/20 rounded border border-red-500/20 text-red-300">
                        ⚠️ {error}
                    </div>
                )}

                {/* Enhanced Prompt */}
                {enhancedPrompt && (
                    <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase opacity-50">Enhanced Prompt</span>
                            <button
                                onClick={handleCopyEnhanced}
                                className="text-[10px] flex items-center gap-1 text-purple-400 hover:text-purple-300"
                            >
                                {copied ? <Check size={10} /> : <Copy size={10} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="p-2 bg-purple-900/20 rounded text-[10px] border border-purple-500/20 max-h-24 overflow-y-auto leading-relaxed">
                            {enhancedPrompt}
                        </div>
                    </div>
                )}

                {/* Tips */}
                {tips.length > 0 && (
                    <div className="mt-3">
                        <span className="text-[10px] uppercase opacity-50 block mb-1">AI Tips</span>
                        <div className="space-y-1">
                            {tips.map((tip, i) => (
                                <div key={i} className="flex items-start gap-1 text-[10px]">
                                    <Lightbulb size={10} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <span className="opacity-70">{tip}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </motion.div>
    );
}
