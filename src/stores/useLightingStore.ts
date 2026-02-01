import { create } from 'zustand';

export interface LightSettings {
    enabled: boolean;
    color: string;
    intensity: number;
    position: { x: number; y: number; z: number };
}

export interface LightingState {
    // 3-Point Lighting
    keyLight: LightSettings;
    fillLight: LightSettings;
    backLight: LightSettings;

    // Practical/Accent Light
    practicalLight: LightSettings;
    practicalType: 'neon' | 'candle' | 'window' | 'screen' | 'none';

    // Atmosphere
    volumetric: boolean;
    fogDensity: number;
    fogColor: string;

    // Actions
    setKeyLight: (settings: Partial<LightSettings>) => void;
    setFillLight: (settings: Partial<LightSettings>) => void;
    setBackLight: (settings: Partial<LightSettings>) => void;
    setPracticalLight: (settings: Partial<LightSettings>) => void;
    setPracticalType: (type: LightingState['practicalType']) => void;
    setVolumetric: (enabled: boolean) => void;
    setFogDensity: (density: number) => void;
    setFogColor: (color: string) => void;
    resetLighting: () => void;
}

const DEFAULT_LIGHTING: Omit<LightingState, 'setKeyLight' | 'setFillLight' | 'setBackLight' | 'setPracticalLight' | 'setPracticalType' | 'setVolumetric' | 'setFogDensity' | 'setFogColor' | 'resetLighting'> = {
    keyLight: {
        enabled: true,
        color: '#ffffff',
        intensity: 1.0,
        position: { x: 3, y: 3, z: 3 },
    },
    fillLight: {
        enabled: true,
        color: '#88aaff',
        intensity: 0.4,
        position: { x: -3, y: 1, z: 2 },
    },
    backLight: {
        enabled: true,
        color: '#ffaa44',
        intensity: 0.6,
        position: { x: 0, y: 2, z: -4 },
    },
    practicalLight: {
        enabled: false,
        color: '#ff00ff',
        intensity: 0.5,
        position: { x: 2, y: 0, z: 1 },
    },
    practicalType: 'none',
    volumetric: false,
    fogDensity: 0.02,
    fogColor: '#1a1a2e',
};

export const useLightingStore = create<LightingState>((set) => ({
    ...DEFAULT_LIGHTING,

    setKeyLight: (settings) => set((state) => ({
        keyLight: { ...state.keyLight, ...settings }
    })),

    setFillLight: (settings) => set((state) => ({
        fillLight: { ...state.fillLight, ...settings }
    })),

    setBackLight: (settings) => set((state) => ({
        backLight: { ...state.backLight, ...settings }
    })),

    setPracticalLight: (settings) => set((state) => ({
        practicalLight: { ...state.practicalLight, ...settings }
    })),

    setPracticalType: (type) => set({
        practicalType: type,
        practicalLight: {
            ...DEFAULT_LIGHTING.practicalLight,
            enabled: type !== 'none',
            color: type === 'neon' ? '#ff00ff' :
                type === 'candle' ? '#ff9933' :
                    type === 'window' ? '#aaccff' :
                        type === 'screen' ? '#00ffaa' : '#ffffff'
        }
    }),

    setVolumetric: (enabled) => set({ volumetric: enabled }),
    setFogDensity: (density) => set({ fogDensity: density }),
    setFogColor: (color) => set({ fogColor: color }),

    resetLighting: () => set(DEFAULT_LIGHTING),
}));
