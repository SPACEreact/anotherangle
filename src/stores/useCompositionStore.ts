import { create } from 'zustand';

export interface DepthLayer {
    description: string;
    fogDensity: number; // 0-100
}

export interface CompositionState {
    foreground: DepthLayer;
    midground: DepthLayer;
    background: DepthLayer;

    // Depth of Field
    focusLayer: 'foreground' | 'midground' | 'background';
    depthBlur: number; // 0-100

    // Actions
    setForeground: (layer: Partial<DepthLayer>) => void;
    setMidground: (layer: Partial<DepthLayer>) => void;
    setBackground: (layer: Partial<DepthLayer>) => void;
    setFocusLayer: (layer: CompositionState['focusLayer']) => void;
    setDepthBlur: (blur: number) => void;
    reset: () => void;
}

const DEFAULT_STATE = {
    foreground: {
        description: '',
        fogDensity: 10,
    },
    midground: {
        description: '',
        fogDensity: 0,
    },
    background: {
        description: '',
        fogDensity: 40,
    },
    focusLayer: 'midground' as const,
    depthBlur: 30,
};

export const useCompositionStore = create<CompositionState>((set) => ({
    ...DEFAULT_STATE,

    setForeground: (layer) => set((state) => ({
        foreground: { ...state.foreground, ...layer }
    })),

    setMidground: (layer) => set((state) => ({
        midground: { ...state.midground, ...layer }
    })),

    setBackground: (layer) => set((state) => ({
        background: { ...state.background, ...layer }
    })),

    setFocusLayer: (focusLayer) => set({ focusLayer }),
    setDepthBlur: (depthBlur) => set({ depthBlur }),

    reset: () => set(DEFAULT_STATE),
}));
