import { create } from 'zustand';
import type { SceneSettings } from '../types';

interface SceneStore extends SceneSettings {
    setSubject: (value: string) => void;
    setSetting: (value: string) => void;
    setCharSheet: (value: string | null) => void;
    setLens: (value: string) => void;
    setAspectRatio: (value: string) => void;
    setLighting: (value: string) => void;
    setFilmStock: (value: string) => void;
    updateScene: (updates: Partial<SceneSettings>) => void;
    reset: () => void;
}

const DEFAULT_SCENE: SceneSettings = {
    subject: "A cyberpunk samurai warrior",
    setting: "neon-lit rain slicked streets",
    charSheet: null,
    lens: "50mm",
    aspectRatio: "16:9",
    lighting: "natural",
    filmStock: "digital",
};

export const useSceneStore = create<SceneStore>((set) => ({
    ...DEFAULT_SCENE,

    setSubject: (value: string) => set({ subject: value }),
    setSetting: (value: string) => set({ setting: value }),
    setCharSheet: (value: string | null) => set({ charSheet: value }),
    setLens: (value: string) => set({ lens: value }),
    setAspectRatio: (value: string) => set({ aspectRatio: value }),
    setLighting: (value: string) => set({ lighting: value }),
    setFilmStock: (value: string) => set({ filmStock: value }),

    updateScene: (updates: Partial<SceneSettings>) => set((state) => ({
        ...state,
        ...updates,
    })),

    reset: () => set(DEFAULT_SCENE),
}));
