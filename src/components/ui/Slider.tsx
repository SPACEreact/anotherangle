import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

interface SliderProps {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    label?: string;
    leftLabel?: string;
    rightLabel?: string;
    showValue?: boolean;
    color?: 'primary' | 'purple' | 'pink' | 'emerald' | 'cyan';
    className?: string;
}

export function Slider({
    value,
    onChange,
    min,
    max,
    step = 1,
    label,
    leftLabel,
    rightLabel,
    showValue = true,
    color = 'primary',
    className,
}: SliderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);

    const colorStyles = {
        primary: 'accent-primary-500',
        purple: 'accent-purple-500',
        pink: 'accent-pink-500',
        emerald: 'accent-emerald-500',
        cyan: 'accent-cyan-500',
    };

    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className={clsx('space-y-2', className)}>
            {/* Labels */}
            {(label || showValue || leftLabel || rightLabel) && (
                <div className="flex justify-between items-center">
                    {label && (
                        <label className="text-[10px] font-bold uppercase opacity-50">
                            {label}
                        </label>
                    )}
                    {leftLabel && rightLabel && !label && (
                        <div className="flex justify-between w-full text-[10px] font-bold uppercase opacity-50">
                            <span>{leftLabel}</span>
                            <span>{rightLabel}</span>
                        </div>
                    )}
                    {showValue && !leftLabel && !rightLabel && (
                        <span className="text-xs font-mono text-zinc-400">
                            {value}°
                        </span>
                    )}
                </div>
            )}

            {/* Slider Track */}
            <div
                ref={sliderRef}
                className={clsx(
                    'relative h-2 bg-zinc-800 rounded-full cursor-pointer group',
                    isDragging && 'cursor-grabbing'
                )}
            >
                {/* Progress Fill */}
                <div
                    className={clsx(
                        'absolute h-full rounded-full transition-all',
                        color === 'primary' && 'bg-primary-500',
                        color === 'purple' && 'bg-purple-500',
                        color === 'pink' && 'bg-pink-500',
                        color === 'emerald' && 'bg-emerald-500',
                        color === 'cyan' && 'bg-cyan-500'
                    )}
                    style={{ width: `${percentage}%` }}
                />

                {/* Slider Input */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                    className={clsx(
                        'absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10',
                        colorStyles[color]
                    )}
                />

                {/* Thumb */}
                <div
                    className={clsx(
                        'absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all pointer-events-none shadow-lg',
                        color === 'primary' && 'bg-primary-500 shadow-primary-500/50',
                        color === 'purple' && 'bg-purple-500 shadow-purple-500/50',
                        color === 'pink' && 'bg-pink-500 shadow-pink-500/50',
                        color === 'emerald' && 'bg-emerald-500 shadow-emerald-500/50',
                        color === 'cyan' && 'bg-cyan-500 shadow-cyan-500/50',
                        isDragging ? 'scale-125' : 'group-hover:scale-110'
                    )}
                    style={{ left: `calc(${percentage}% - 0.5rem)` }}
                />
            </div>

            {/* Range Labels (if not shown above) */}
            {leftLabel && rightLabel && label && (
                <div className="flex justify-between text-[10px] font-bold uppercase opacity-50">
                    <span>{leftLabel}</span>
                    <span>{rightLabel}</span>
                </div>
            )}
        </div>
    );
}
