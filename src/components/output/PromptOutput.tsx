import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { usePromptGenerator } from '../../hooks/usePromptGenerator';
import { copyToClipboard } from '../../utils/promptBuilder';
import { useUIStore } from '../../stores/useUIStore';
import { motion } from 'framer-motion';

export function PromptOutput() {
    const { prompt } = usePromptGenerator();
    const [copied, setCopied] = useState(false);
    const addNotification = useUIStore((state) => state.addNotification);

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
        const success = await copyToClipboard(prompt);
        if (success) {
            setCopied(true);
            addNotification('Prompt copied to clipboard!', 'success');
            setTimeout(() => setCopied(false), 2000);
        } else {
            addNotification('Failed to copy prompt', 'error');
        }
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
                        Final Prompt
                    </span>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-slow"></div>
                </div>

                {/* Prompt Display */}
                <div className="flex-1 p-3 rounded-lg font-mono text-xs leading-5 overflow-y-auto custom-scrollbar mb-4 bg-zinc-950 text-primary-100 border border-zinc-800">
                    {prompt}
                </div>

                {/* Copy Button */}
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
            </Card>
        </motion.div>
    );
}
