import type { LightingSetup } from '../types';

export const lightingSetups: LightingSetup[] = [
    {
        id: "natural",
        name: "Natural Light",
        prompt: "natural ambient lighting, soft shadows",
        icon: "sun"
    },
    {
        id: "golden",
        name: "Golden Hour",
        prompt: "warm golden hour lighting, sunset glow, long shadows",
        icon: "sunrise"
    },
    {
        id: "rembrandt",
        name: "Rembrandt",
        prompt: "dramatic rembrandt lighting, chiaroscuro, triangle of light",
        icon: "triangle"
    },
    {
        id: "rim",
        name: "Rim / Backlight",
        prompt: "strong rim lighting, silhouette contour, edge definition",
        icon: "circle"
    },
    {
        id: "volumetric",
        name: "Volumetric",
        prompt: "hazy volumetric god rays, atmospheric fog, light beams",
        icon: "zap"
    },
    {
        id: "neon",
        name: "Neon / Cyber",
        prompt: "cyan and magenta neon lighting, bioluminescence, electric atmosphere",
        icon: "sparkles"
    },
    {
        id: "studio",
        name: "Softbox Studio",
        prompt: "professional studio softbox lighting, even illumination, clean shadows",
        icon: "box"
    },
    {
        id: "cinematic",
        name: "Cinematic",
        prompt: "cinematic three-point lighting, professional film setup, dramatic contrast",
        icon: "film"
    },
    {
        id: "moody",
        name: "Moody Low-Key",
        prompt: "moody low-key lighting, deep shadows, mystery atmosphere",
        icon: "moon"
    },
];
