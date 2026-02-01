// Core Types for CinePrompt Studio

export interface CameraAngles {
    azimuth: number;    // Y-axis rotation (0-360)
    elevation: number;  // X-axis rotation (-90 to 90)
    roll: number;       // Z-axis rotation (-45 to 45)
}

export interface SceneSettings {
    subject: string;
    setting: string;
    charSheet: string | null;
    lens: string;
    aspectRatio: string;
    lighting: string;
    filmStock: string;
}

export interface LensOption {
    id: string;
    name: string;
    desc: string;
    focalLength?: number;
}

export interface LightingSetup {
    id: string;
    name: string;
    prompt: string;
    icon?: string;
}

export interface FilmStock {
    id: string;
    name: string;
    prompt: string;
    category?: 'digital' | 'film' | 'specialty';
}

export interface CameraPreset {
    id: string;
    name: string;
    description: string;
    angles: CameraAngles;
    icon?: string;
}

export interface UIState {
    darkMode: boolean;
    copied: boolean;
    currentPreset: string | null;
    showKeyboardHelp: boolean;
}

export interface PromptSegment {
    type: 'reference' | 'subject' | 'camera' | 'setting' | 'lighting' | 'quality' | 'parameters';
    content: string;
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '2.35:1' | '4:3' | '21:9';

export interface ExportedConfiguration {
    version: string;
    timestamp: number;
    camera: CameraAngles;
    scene: SceneSettings;
}
