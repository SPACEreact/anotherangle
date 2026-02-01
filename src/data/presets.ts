import type { CameraPreset } from '../types';

export const cameraPresets: CameraPreset[] = [
    {
        id: 'hero',
        name: 'Hero Shot',
        description: 'Slight low angle, front-facing, cinematic',
        angles: { azimuth: 0, elevation: -15, roll: 0 },
        icon: 'star'
    },
    {
        id: 'dramatic-low',
        name: 'Dramatic Low',
        description: "Worm's eye view, powerful perspective",
        angles: { azimuth: 45, elevation: -45, roll: 0 },
        icon: 'arrow-up'
    },
    {
        id: 'overhead',
        name: 'Overhead',
        description: "Bird's eye view, top-down perspective",
        angles: { azimuth: 0, elevation: 80, roll: 0 },
        icon: 'arrow-down'
    },
    {
        id: 'profile',
        name: 'Side Profile',
        description: 'Clean 90° side view',
        angles: { azimuth: 90, elevation: 0, roll: 0 },
        icon: 'scan-line'
    },
    {
        id: 'three-quarter',
        name: 'Three Quarter',
        description: 'Classic portrait angle',
        angles: { azimuth: 45, elevation: 15, roll: 0 },
        icon: 'box'
    },
    {
        id: 'dutch-angle',
        name: 'Dutch Angle',
        description: 'Tilted, dynamic unease',
        angles: { azimuth: 30, elevation: 5, roll: 25 },
        icon: 'rotate-cw'
    },
    {
        id: 'back-view',
        name: 'Back View',
        description: 'Over the shoulder perspective',
        angles: { azimuth: 180, elevation: 10, roll: 0 },
        icon: 'corner-down-left'
    },
    {
        id: 'high-angle',
        name: 'High Angle',
        description: 'Looking down, vulnerable feel',
        angles: { azimuth: 25, elevation: 35, roll: 0 },
        icon: 'chevron-down'
    },
];
