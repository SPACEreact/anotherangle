import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { clsx } from 'clsx';

export function Toast() {
    const notifications = useUIStore((state: any) => state.notifications);
    const removeNotification = useUIStore((state: any) => state.removeNotification);

    useEffect(() => {
        notifications.forEach((notification: any) => {
            const timer = setTimeout(() => {
                removeNotification(notification.id);
            }, 4000);

            return () => clearTimeout(timer);
        });
    }, [notifications, removeNotification]);

    const icons: any = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info,
    };

    const colors: any = {
        success: 'bg-green-600 border-green-500',
        error: 'bg-red-600 border-red-500',
        info: 'bg-blue-600 border-blue-500',
    };

    return (
        <div className="fixed top-20 right-6 z-[100] space-y-2 pointer-events-none">
            <AnimatePresence>
                {notifications.map((notification: any) => {
                    const Icon = icons[notification.type];
                    return (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: 100, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.8 }}
                            className={clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border-2 pointer-events-auto min-w-[280px]',
                                colors[notification.type]
                            )}
                        >
                            <Icon size={18} className="flex-shrink-0" />
                            <span className="flex-1 text-sm font-medium text-white">
                                {notification.message}
                            </span>
                            <button
                                onClick={() => removeNotification(notification.id)}
                                className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
