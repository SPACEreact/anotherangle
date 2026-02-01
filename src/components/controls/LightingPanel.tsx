import { Zap } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { useSceneStore } from '../../stores/useSceneStore';
import { lightingSetups } from '../../data/lightingSetups';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export function LightingPanel() {
    const { lighting, setLighting } = useSceneStore();

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <Card>
                <CardHeader icon={<Zap size={14} className="text-yellow-500" />}>
                    <span className="text-yellow-500">Lighting Rig</span>
                </CardHeader>

                <div className="grid grid-cols-2 gap-2">
                    {lightingSetups.map((setup, index) => (
                        <motion.button
                            key={setup.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            onClick={() => setLighting(setup.id)}
                            className={clsx(
                                'text-left px-3 py-2 rounded-lg text-xs transition-all border',
                                lighting === setup.id
                                    ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400'
                                    : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-zinc-400'
                            )}
                        >
                            <div className="font-bold">{setup.name}</div>
                        </motion.button>
                    ))}
                </div>
            </Card>
        </motion.div>
    );
}
