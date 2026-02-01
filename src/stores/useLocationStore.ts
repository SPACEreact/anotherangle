import { create } from 'zustand';

export type LocationMode = 'earth' | 'cosmic';

export interface MapCoordinates {
    lat: number;
    lng: number;
    placeName: string;
}

export interface LocationState {
    // Mode
    mode: LocationMode;

    // Map coordinates (for interactive map)
    coordinates: MapCoordinates | null;

    // Earth locations (preset or custom)
    earthLocation: string;
    customLocation: string;

    // Cosmic locations
    cosmicLocation: string;

    // Time settings
    era: string;
    year: number;
    timeOfDay: string;

    // Weather & Season
    weather: string;
    season: string;

    // Smart Filter
    smartFilterEnabled: boolean;

    // Actions
    setMode: (mode: LocationMode) => void;
    setCoordinates: (coords: MapCoordinates | null) => void;
    setEarthLocation: (location: string) => void;
    setCustomLocation: (location: string) => void;
    setCosmicLocation: (location: string) => void;
    setEra: (era: string) => void;
    setYear: (year: number) => void;
    setTimeOfDay: (time: string) => void;
    setWeather: (weather: string) => void;
    setSeason: (season: string) => void;
    setSmartFilterEnabled: (enabled: boolean) => void;
    reset: () => void;
}

const DEFAULT_STATE = {
    mode: 'earth' as LocationMode,
    coordinates: null as MapCoordinates | null,
    earthLocation: '',
    customLocation: '',
    cosmicLocation: '',
    era: 'modern',
    year: 2024,
    timeOfDay: 'day',
    weather: 'clear',
    season: 'summer',
    smartFilterEnabled: true,
};

export const useLocationStore = create<LocationState>((set) => ({
    ...DEFAULT_STATE,

    setMode: (mode) => set({ mode }),
    setCoordinates: (coordinates) => set({ coordinates, mode: 'earth' }),
    setEarthLocation: (earthLocation) => set({ earthLocation, mode: 'earth', coordinates: null }),
    setCustomLocation: (customLocation) => set({ customLocation }),
    setCosmicLocation: (cosmicLocation) => set({ cosmicLocation, mode: 'cosmic' }),
    setEra: (era) => set({ era }),
    setYear: (year) => set({ year }),
    setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
    setWeather: (weather) => set({ weather }),
    setSeason: (season) => set({ season }),
    setSmartFilterEnabled: (smartFilterEnabled) => set({ smartFilterEnabled }),

    reset: () => set(DEFAULT_STATE),
}));
