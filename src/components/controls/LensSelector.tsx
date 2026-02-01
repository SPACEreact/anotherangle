import { Box } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { useSceneStore } from '../../stores/useSceneStore';
import { lenses, aspectRatios } from '../../data/lenses';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export function LensSelector() {
    const { lens, aspectRatio, setLens, setAspectRatio } = useSceneStore();

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
        >
            <Card>
                <CardHeader icon={<Box size={14} className="text-emerald-500" />}>
                    <span className="text-emerald-500">Lens & Frame</span>
                </CardHeader>

                {/* Lens Selection */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {lenses.map((l, index) => (
                        <motion.button
                            key={l.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            onClick={() => setLens(l.id)}
                            className={clsx(
                                'text-center py-2 rounded-lg text-xs font-bold transition-all border',
                                lens === l.id
                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                    : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:bg-zinc-800'
                            )}
                        >
                            {l.name}
                        </motion.button>
                    ))}
                </div>

                {/* Aspect Ratio Selection */}
                <div className="flex gap-2 justify-center p-2 rounded-lg bg-black/20">
                    {aspectRatios.map((ratio, index) => (
                        <motion.button
                            key={ratio.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                            onClick={() => setAspectRatio(ratio.id)}
                            className={clsx(
                                'px-3 py-1 rounded text-[10px] font-bold uppercase transition',
                                aspectRatio === ratio.id
                                    ? 'bg-emerald-600 text-white'
                                    : 'text-zinc-500 hover:bg-black/10'
                            )}
                        >
                            {ratio.id}
                        </motion.button>
                    ))}
                </div>
            </Card>
        </motion.div>
    );
}
