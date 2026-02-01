import { RotateCcw } from 'lucide-react';
import { useCameraStore } from '../../stores/useCameraStore';
import { Scene3D } from '../viewport/Scene3D';
import { motion } from 'framer-motion';

export function ViewportContainer() {
    const { azimuth, elevation, roll, reset } = useCameraStore();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 relative"
        >
            {/* 3D Scene */}
            <Scene3D />

            {/* HUD Overlay */}
            <div className="absolute top-6 left-6 font-mono text-[10px] space-y-1 opacity-50 pointer-events-none">
                <div>AZIMUTH: {azimuth}°</div>
                <div>ELEVATION: {elevation}°</div>
                <div>ROLL: {roll}°</div>
            </div>

            {/* Reset Button */}
            <button
                onClick={reset}
                className="absolute bottom-6 right-6 p-3 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white transition-all hover:scale-110 active:scale-95"
                title="Reset camera (R)"
            >
                <RotateCcw size={18} />
            </button>
        </motion.div>
    );
}
