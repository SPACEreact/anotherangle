import { Camera, Sun, Moon } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { motion } from 'framer-motion';

export function Header() {
    const { darkMode, toggleDarkMode } = useUIStore();

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="px-6 py-3 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md flex justify-between items-center sticky top-0 z-50"
        >
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary-600 to-primary-400 p-2 rounded-lg text-white shadow-lg shadow-primary-500/20">
                    <Camera size={20} />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight">
                        CinePrompt Studio{' '}
                        <span className="text-primary-500 text-xs uppercase ml-1">Pro</span>
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    title="Toggle theme"
                >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
        </motion.header>
    );
}
