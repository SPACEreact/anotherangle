import { type ReactNode } from 'react';
import { clsx } from 'clsx';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export function Button({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    fullWidth = false,
    className,
    type = 'button',
}: ButtonProps) {
    const baseStyles = 'font-semibold rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2';

    const variantStyles = {
        primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20',
        secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700',
        ghost: 'bg-transparent hover:bg-zinc-800/50 text-zinc-300',
        success: 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20',
        danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-4 text-base',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                fullWidth && 'w-full',
                className
            )}
        >
            {children}
        </button>
    );
}
