import { Layers, Mountain, Trees, Frame } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Slider } from '../ui/Slider';
import { useCompositionStore } from '../../stores/useCompositionStore';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface LayerControlProps {
    label: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    fogDensity: number;
    isFocused: boolean;
    onDescriptionChange: (desc: string) => void;
    onFogChange: (fog: number) => void;
    onFocus: () => void;
}

function LayerControl({
    label, icon, color, description, fogDensity, isFocused,
    onDescriptionChange, onFogChange, onFocus
}: LayerControlProps) {
    const hasContent = description.trim().length > 0;

    return (
        <div className={clsx(
            'p-3 rounded-lg border transition-all',
            isFocused ? 'bg-zinc-800/80 border-primary-500/50 ring-1 ring-primary-500/30' :
                hasContent ? 'bg-zinc-800/50 border-zinc-700' : 'bg-zinc-900/30 border-zinc-800'
        )}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className={color}>{icon}</span>
                    <span className={clsx('text-xs font-bold uppercase', color)}>{label}</span>
                    {hasContent && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">Active</span>
                    )}
                </div>
                <button
                    onClick={onFocus}
                    className={clsx(
                        'text-[10px] px-2 py-0.5 rounded uppercase font-bold transition-all',
                        isFocused ? 'bg-primary-500 text-white' : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                    )}
                >
                    {isFocused ? 'In Focus' : 'Focus'}
                </button>
            </div>

            <textarea
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder={`Describe ${label.toLowerCase()} elements...`}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded p-2 text-xs resize-none h-14 focus:border-primary-500 focus:outline-none transition-colors"
            />

            <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] opacity-50 w-12">Fog:</span>
                <div className="flex-1">
                    <Slider
                        value={fogDensity}
                        onChange={onFogChange}
                        min={0}
                        max={100}
                        showValue={false}
                        color="cyan"
                    />
                </div>
                <span className="text-[10px] font-mono opacity-70 w-8">{fogDensity}%</span>
            </div>
        </div>
    );
}

export function CompositionPanel() {
    const {
        foreground, midground, background, focusLayer, depthBlur,
        setForeground, setMidground, setBackground, setFocusLayer, setDepthBlur
    } = useCompositionStore();

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card>
                <CardHeader icon={<Layers size={14} className="text-emerald-500" />}>
                    <span className="text-emerald-500">Composition Layers</span>
                </CardHeader>

                <div className="space-y-2">
                    {/* Foreground */}
                    <LayerControl
                        label="Foreground"
                        icon={<Trees size={12} />}
                        color="text-green-400"
                        description={foreground.description}
                        fogDensity={foreground.fogDensity}
                        isFocused={focusLayer === 'foreground'}
                        onDescriptionChange={(desc) => setForeground({ description: desc })}
                        onFogChange={(fog) => setForeground({ fogDensity: fog })}
                        onFocus={() => setFocusLayer('foreground')}
                    />

                    {/* Midground */}
                    <LayerControl
                        label="Midground (Subject)"
                        icon={<Frame size={12} />}
                        color="text-yellow-400"
                        description={midground.description}
                        fogDensity={midground.fogDensity}
                        isFocused={focusLayer === 'midground'}
                        onDescriptionChange={(desc) => setMidground({ description: desc })}
                        onFogChange={(fog) => setMidground({ fogDensity: fog })}
                        onFocus={() => setFocusLayer('midground')}
                    />

                    {/* Background */}
                    <LayerControl
                        label="Background"
                        icon={<Mountain size={12} />}
                        color="text-blue-400"
                        description={background.description}
                        fogDensity={background.fogDensity}
                        isFocused={focusLayer === 'background'}
                        onDescriptionChange={(desc) => setBackground({ description: desc })}
                        onFogChange={(fog) => setBackground({ fogDensity: fog })}
                        onFocus={() => setFocusLayer('background')}
                    />
                </div>

                {/* Depth of Field */}
                <div className="mt-4 pt-3 border-t border-zinc-800">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] uppercase opacity-50">Depth Blur</span>
                    </div>
                    <Slider
                        value={depthBlur}
                        onChange={setDepthBlur}
                        min={0}
                        max={100}
                        showValue
                        color="primary"
                    />
                </div>
            </Card>
        </motion.div>
    );
}
