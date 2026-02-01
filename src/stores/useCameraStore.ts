import { create } from 'zustand';
import type { CameraAngles } from '../types';

interface CameraStore extends CameraAngles {
    setAzimuth: (value: number) => void;
    setElevation: (value: number) => void;
    setRoll: (value: number) => void;
    setAngles: (angles: Partial<CameraAngles>) => void;
    reset: () => void;
    loadPreset: (angles: CameraAngles) => void;
}

const DEFAULT_ANGLES: CameraAngles = {
    azimuth: 45,
    elevation: 15,
    roll: 0,
};

export const useCameraStore = create<CameraStore>((set) => ({
    ...DEFAULT_ANGLES,

    setAzimuth: (value: number) => set({ azimuth: value }),
    setElevation: (value: number) => set({ elevation: value }),
    setRoll: (value: number) => set({ roll: value }),

    setAngles: (angles: Partial<CameraAngles>) => set((state) => ({
        ...state,
        ...angles,
    })),

    reset: () => set(DEFAULT_ANGLES),

    loadPreset: (angles: CameraAngles) => set(angles),
}));
