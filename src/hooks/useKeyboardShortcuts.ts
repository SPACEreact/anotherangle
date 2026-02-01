import { useEffect } from 'react';
import { useCameraStore } from '../stores/useCameraStore';
import { useUIStore } from '../stores/useUIStore';
import { cameraPresets } from '../data/presets';

/**
 * Hook to handle keyboard shortcuts for camera controls
 */
export function useKeyboardShortcuts() {
    const { azimuth, elevation, roll, setAzimuth, setElevation, setRoll, reset, loadPreset } = useCameraStore();
    const { toggleDarkMode, toggleKeyboardHelp, setCopied } = useUIStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in input/textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            const step = e.shiftKey ? 5 : 1; // Hold shift for larger steps

            switch (e.key.toLowerCase()) {
                // Camera rotation (Arrow keys)
                case 'arrowleft':
                    e.preventDefault();
                    setAzimuth(azimuth - step);
                    break;
                case 'arrowright':
                    e.preventDefault();
                    setAzimuth(azimuth + step);
                    break;
                case 'arrowup':
                    e.preventDefault();
                    setElevation(Math.min(90, elevation + step));
                    break;
                case 'arrowdown':
                    e.preventDefault();
                    setElevation(Math.max(-90, elevation - step));
                    break;

                // Roll (Shift + Q/E)
                case 'q':
                    if (e.shiftKey) {
                        e.preventDefault();
                        setRoll(Math.max(-45, roll - 5));
                    }
                    break;
                case 'e':
                    if (e.shiftKey) {
                        e.preventDefault();
                        setRoll(Math.min(45, roll + 5));
                    }
                    break;

                // Reset camera (R)
                case 'r':
                    e.preventDefault();
                    reset();
                    break;

                // Copy prompt (C)
                case 'c':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        // Trigger copy (handled in PromptOutput component)
                        const copyEvent = new CustomEvent('copy-prompt');
                        window.dispatchEvent(copyEvent);
                    }
                    break;

                // Dark mode toggle (D)
                case 'd':
                    e.preventDefault();
                    toggleDarkMode();
                    break;

                // Keyboard help (?)
                case '?':
                    e.preventDefault();
                    toggleKeyboardHelp();
                    break;

                // Preset shortcuts (1-8)
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                    e.preventDefault();
                    const presetIndex = parseInt(e.key) - 1;
                    if (presetIndex < cameraPresets.length) {
                        loadPreset(cameraPresets[presetIndex].angles);
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [azimuth, elevation, roll, setAzimuth, setElevation, setRoll, reset, loadPreset, toggleDarkMode, toggleKeyboardHelp]);
}
