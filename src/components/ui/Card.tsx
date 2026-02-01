import { type ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: boolean;
    hover?: boolean;
}

export function Card({
    children,
    className,
    padding = true,
    hover = false
}: CardProps) {
    return (
        <div
            className={clsx(
                'bg-zinc-900 rounded-xl border border-zinc-800 transition-colors',
                padding && 'p-4',
                hover && 'hover:bg-zinc-800/50 hover:border-zinc-700',
                className
            )}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: ReactNode;
    icon?: ReactNode;
    className?: string;
}

export function CardHeader({ children, icon, className }: CardHeaderProps) {
    return (
        <div className={clsx('flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-4', className)}>
            {icon}
            {children}
        </div>
    );
}
