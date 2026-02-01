import type { FilmStock } from '../types';

export const filmStocks: FilmStock[] = [
    {
        id: "digital",
        name: "Digital Sharp",
        prompt: "8k resolution, razor sharp focus, digital cinema camera",
        category: 'digital'
    },
    {
        id: "kodak-portra",
        name: "Kodak Portra 400",
        prompt: "Kodak Portra 400 film stock, fine grain, natural skin tones, vintage warmth",
        category: 'film'
    },
    {
        id: "kodak-gold",
        name: "Kodak Gold 200",
        prompt: "Kodak Gold 200, nostalgic warm tones, classic film aesthetic",
        category: 'film'
    },
    {
        id: "fuji-velvia",
        name: "Fuji Velvia 50",
        prompt: "Fujifilm Velvia 50, hyper saturated colors, vibrant landscapes, slide film",
        category: 'film'
    },
    {
        id: "fuji-superia",
        name: "Fuji Superia",
        prompt: "Fujifilm Superia, cool color cast, everyday film aesthetic",
        category: 'film'
    },
    {
        id: "cinestill-800t",
        name: "CineStill 800T",
        prompt: "CineStill 800T tungsten film, halation glow, cinematic night photography",
        category: 'specialty'
    },
    {
        id: "ilford-hp5",
        name: "Ilford HP5",
        prompt: "Ilford HP5 Plus, black and white photography, high contrast, classic grain",
        category: 'film'
    },
    {
        id: "ilford-delta",
        name: "Ilford Delta 3200",
        prompt: "Ilford Delta 3200, extreme grain, gritty black and white, noir aesthetic",
        category: 'specialty'
    },
    {
        id: "polaroid",
        name: "Polaroid SX-70",
        prompt: "Polaroid SX-70 instant film, soft focus, vintage instant photo aesthetic",
        category: 'specialty'
    },
];
