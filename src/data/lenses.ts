import type { LensOption } from '../types';

export const lenses: LensOption[] = [
    {
        id: "16mm",
        name: "16mm Wide",
        desc: "Epic scale, distortion",
        focalLength: 16
    },
    {
        id: "24mm",
        name: "24mm Wide",
        desc: "Environmental storytelling",
        focalLength: 24
    },
    {
        id: "35mm",
        name: "35mm Street",
        desc: "Cinematic standard",
        focalLength: 35
    },
    {
        id: "50mm",
        name: "50mm Prime",
        desc: "Human eye perspective",
        focalLength: 50
    },
    {
        id: "85mm",
        name: "85mm Portrait",
        desc: "Compression, bokeh",
        focalLength: 85
    },
    {
        id: "135mm",
        name: "135mm Tele",
        desc: "Intimate close-ups",
        focalLength: 135
    },
    {
        id: "200mm",
        name: "200mm Super Tele",
        desc: "Extreme compression",
        focalLength: 200
    },
];

export const aspectRatios = [
    { id: '1:1', name: 'Square', width: 1, height: 1 },
    { id: '4:3', name: 'Classic', width: 4, height: 3 },
    { id: '16:9', name: 'Widescreen', width: 16, height: 9 },
    { id: '9:16', name: 'Vertical', width: 9, height: 16 },
    { id: '21:9', name: 'Ultrawide', width: 21, height: 9 },
    { id: '2.35:1', name: 'Anamorphic', width: 2.35, height: 1 },
];
