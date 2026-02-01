import { Sun, Lightbulb, Sparkles, CloudFog } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Slider } from '../ui/Slider';
import { useLightingStore } from '../../stores/useLightingStore';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

// Color presets for quick selection
const colorPresets = [
    { color: '#ffffff', name: 'White' },
    { color: '#fff5e6', name: 'Warm' },
    { color: '#e6f0ff', name: 'Cool' },
    { color: '#ff6b6b', name: 'Red' },
    { color: '#4ecdc4', name: 'Cyan' },
    { color: '#ff00ff', name: 'Magenta' },
    { color: '#ffaa00', name: 'Orange' },
    { color: '#00ff88', name: 'Green' },
];

const practicalTypes = [
    { id: 'none', name: 'None', icon: '○' },
    { id: 'neon', name: 'Neon Sign', icon: '💡' },
    { id: 'candle', name: 'Candle/Fire', icon: '🔥' },
    { id: 'window', name: 'Window', icon: '🪟' },
    { id: 'screen', name: 'Screen Glow', icon: '📺' },
] as const;

interface LightControlProps {
    label: string;
    color: string;
    accentColor: string;
    enabled: boolean;
    intensity: number;
    lightColor: string;
    onToggle: () => void;
    onIntensityChange: (val: number) => void;
    onColorChange: (color: string) => void;
}

function LightControl({
    label, color, accentColor, enabled, intensity, lightColor,
    onToggle, onIntensityChange, onColorChange
}: LightControlProps) {
    return (
        <div className={clsx(
            'p-3 rounded-lg border transition-all',
            enabled ? 'bg-zinc-800/50 border-zinc-700' : 'bg-zinc-900/50 border-zinc-800 opacity-50'
        )}>
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={onToggle}
                    className="flex items-center gap-2"
                >
                    <div className={clsx(
                        'w-3 h-3 rounded-full transition-all',
                        enabled ? 'shadow-lg' : 'opacity-30'
                    )} style={{ backgroundColor: enabled ? lightColor : '#666', boxShadow: enabled ? `0 0 10px ${lightColor}` : 'none' }} />
                    <span className={clsx('text-xs font-bold uppercase', color)}>{label}</span>
                </button>

                {/* Color picker */}
                <div className="flex gap-1">
                    {colorPresets.slice(0, 4).map((preset) => (
                        <button
                            key={preset.color}
                            onClick={() => onColorChange(preset.color)}
                            className={clsx(
                                'w-4 h-4 rounded-full border-2 transition-transform hover:scale-125',
                                lightColor === preset.color ? 'border-white' : 'border-transparent'
                            )}
                            style={{ backgroundColor: preset.color }}
                            title={preset.name}
                        />
                    ))}
                    <input
                        type="color"
                        value={lightColor}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="w-4 h-4 rounded cursor-pointer"
                        title="Custom color"
                    />
                </div>
            </div>

            {enabled && (
                <Slider
                    value={intensity * 100}
                    onChange={(val) => onIntensityChange(val / 100)}
                    min={0}
                    max={200}
                    showValue={false}
                    color={accentColor as any}
                />
            )}
        </div>
    );
}

export function AdvancedLightingPanel() {
    const {
        keyLight, fillLight, backLight, practicalLight, practicalType,
        volumetric, fogDensity, fogColor,
        setKeyLight, setFillLight, setBackLight, setPracticalType,
        setVolumetric, setFogDensity, setFogColor
    } = useLightingStore();

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
        >
            {/* 3-Point Lighting */}
            <Card>
                <CardHeader icon={<Sun size={14} className="text-yellow-500" />}>
                    <span className="text-yellow-500">3-Point Lighting</span>
                </CardHeader>

                <div className="space-y-2">
                    <LightControl
                        label="Key Light"
                        color="text-yellow-400"
                        accentColor="primary"
                        enabled={keyLight.enabled}
                        intensity={keyLight.intensity}
                        lightColor={keyLight.color}
                        onToggle={() => setKeyLight({ enabled: !keyLight.enabled })}
                        onIntensityChange={(intensity) => setKeyLight({ intensity })}
                        onColorChange={(color) => setKeyLight({ color })}
                    />

                    <LightControl
                        label="Fill Light"
                        color="text-blue-400"
                        accentColor="cyan"
                        enabled={fillLight.enabled}
                        intensity={fillLight.intensity}
                        lightColor={fillLight.color}
                        onToggle={() => setFillLight({ enabled: !fillLight.enabled })}
                        onIntensityChange={(intensity) => setFillLight({ intensity })}
                        onColorChange={(color) => setFillLight({ color })}
                    />

                    <LightControl
                        label="Back Light"
                        color="text-orange-400"
                        accentColor="pink"
                        enabled={backLight.enabled}
                        intensity={backLight.intensity}
                        lightColor={backLight.color}
                        onToggle={() => setBackLight({ enabled: !backLight.enabled })}
                        onIntensityChange={(intensity) => setBackLight({ intensity })}
                        onColorChange={(color) => setBackLight({ color })}
                    />
                </div>
            </Card>

            {/* Practical Lights */}
            <Card>
                <CardHeader icon={<Lightbulb size={14} className="text-purple-500" />}>
                    <span className="text-purple-500">Practical Light</span>
                </CardHeader>

                <div className="grid grid-cols-5 gap-1">
                    {practicalTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setPracticalType(type.id)}
                            className={clsx(
                                'p-2 rounded text-center transition-all text-xs',
                                practicalType === type.id
                                    ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300'
                                    : 'bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:bg-zinc-700/50'
                            )}
                            title={type.name}
                        >
                            <div className="text-lg">{type.icon}</div>
                        </button>
                    ))}
                </div>

                {practicalType !== 'none' && (
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] uppercase opacity-50">Color:</span>
                        <div className="flex gap-1 flex-1">
                            {colorPresets.map((preset) => (
                                <button
                                    key={preset.color}
                                    onClick={() => useLightingStore.getState().setPracticalLight({ color: preset.color })}
                                    className={clsx(
                                        'w-5 h-5 rounded-full border-2 transition-transform hover:scale-110',
                                        practicalLight.color === preset.color ? 'border-white' : 'border-transparent'
                                    )}
                                    style={{ backgroundColor: preset.color }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </Card>

            {/* Volumetric / Atmosphere */}
            <Card>
                <CardHeader icon={<CloudFog size={14} className="text-cyan-500" />}>
                    <span className="text-cyan-500">Atmosphere</span>
                </CardHeader>

                <div className="space-y-3">
                    {/* Volumetric toggle */}
                    <button
                        onClick={() => setVolumetric(!volumetric)}
                        className={clsx(
                            'w-full p-2 rounded-lg border text-xs font-bold uppercase transition-all flex items-center justify-center gap-2',
                            volumetric
                                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                                : 'bg-zinc-800/50 border-zinc-700 text-zinc-400'
                        )}
                    >
                        <Sparkles size={14} />
                        {volumetric ? 'Volumetric ON' : 'Add Volumetric Fog'}
                    </button>

                    {volumetric && (
                        <>
                            <Slider
                                value={fogDensity * 100}
                                onChange={(val) => setFogDensity(val / 100)}
                                min={0}
                                max={20}
                                label="Fog Density"
                                showValue={false}
                                color="cyan"
                            />

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase opacity-50">Fog Color:</span>
                                <div className="flex gap-1">
                                    {['#1a1a2e', '#2d1b4e', '#1a2e1a', '#2e1a1a', '#000000'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setFogColor(color)}
                                            className={clsx(
                                                'w-5 h-5 rounded border-2 transition-transform hover:scale-110',
                                                fogColor === color ? 'border-cyan-400' : 'border-transparent'
                                            )}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}
