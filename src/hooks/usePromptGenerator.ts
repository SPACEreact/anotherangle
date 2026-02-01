import { useMemo } from 'react';
import { useCameraStore } from '../stores/useCameraStore';
import { useSceneStore } from '../stores/useSceneStore';
import { useLightingStore } from '../stores/useLightingStore';
import { useCompositionStore } from '../stores/useCompositionStore';
import { useLocationStore } from '../stores/useLocationStore';
import { buildPrompt, buildPromptSegments } from '../utils/promptBuilder';

/**
 * Hook to generate AI prompts from all settings
 * Now passes all store values directly to ensure proper reactivity
 */
export function usePromptGenerator() {
    // Subscribe to ALL store values we need
    const azimuth = useCameraStore(s => s.azimuth);
    const elevation = useCameraStore(s => s.elevation);
    const roll = useCameraStore(s => s.roll);

    const subject = useSceneStore(s => s.subject);
    const setting = useSceneStore(s => s.setting);
    const charSheet = useSceneStore(s => s.charSheet);
    const lens = useSceneStore(s => s.lens);
    const aspectRatio = useSceneStore(s => s.aspectRatio);
    const lightingPreset = useSceneStore(s => s.lighting);
    const filmStock = useSceneStore(s => s.filmStock);

    // Lighting store values
    const keyLight = useLightingStore(s => s.keyLight);
    const fillLight = useLightingStore(s => s.fillLight);
    const backLight = useLightingStore(s => s.backLight);
    const practicalLight = useLightingStore(s => s.practicalLight);
    const practicalType = useLightingStore(s => s.practicalType);
    const volumetric = useLightingStore(s => s.volumetric);
    const fogDensity = useLightingStore(s => s.fogDensity);
    const fogColor = useLightingStore(s => s.fogColor);

    // Composition store values
    const foreground = useCompositionStore(s => s.foreground);
    const midground = useCompositionStore(s => s.midground);
    const background = useCompositionStore(s => s.background);
    const depthBlur = useCompositionStore(s => s.depthBlur);
    const focusLayer = useCompositionStore(s => s.focusLayer);

    // Location store values
    const mode = useLocationStore(s => s.mode);
    const coordinates = useLocationStore(s => s.coordinates);
    const earthLocation = useLocationStore(s => s.earthLocation);
    const customLocation = useLocationStore(s => s.customLocation);
    const cosmicLocation = useLocationStore(s => s.cosmicLocation);
    const era = useLocationStore(s => s.era);
    const year = useLocationStore(s => s.year);
    const timeOfDay = useLocationStore(s => s.timeOfDay);
    const weather = useLocationStore(s => s.weather);
    const season = useLocationStore(s => s.season);
    const smartFilterEnabled = useLocationStore(s => s.smartFilterEnabled);

    // Build options object with all values
    const options = useMemo(() => ({
        camera: { azimuth, elevation, roll },
        scene: { subject, setting, charSheet, lens, aspectRatio, lighting: lightingPreset, filmStock },
        lighting: { keyLight, fillLight, backLight, practicalLight, practicalType, volumetric, fogDensity, fogColor },
        composition: { foreground, midground, background, depthBlur, focusLayer },
        location: { mode, coordinates, earthLocation, customLocation, cosmicLocation, era, year, timeOfDay, weather, season, smartFilterEnabled },
    }), [
        azimuth, elevation, roll,
        subject, setting, charSheet, lens, aspectRatio, lightingPreset, filmStock,
        keyLight, fillLight, backLight, practicalLight, practicalType, volumetric, fogDensity, fogColor,
        foreground, midground, background, depthBlur, focusLayer,
        mode, coordinates, earthLocation, customLocation, cosmicLocation, era, year, timeOfDay, weather, season, smartFilterEnabled,
    ]);

    const prompt = useMemo(() => buildPrompt(options), [options]);
    const segments = useMemo(() => buildPromptSegments(options), [options]);

    return { prompt, segments };
}
