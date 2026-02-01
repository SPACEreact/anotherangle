import type { CameraAngles, SceneSettings } from '../types';
import { lenses } from '../data/lenses';
import { filmStocks } from '../data/filmStocks';
import { earthLocations, cosmicLocations, eras, timesOfDay, weatherOptions, seasons } from '../data/locations';
import { getCameraAngleDescription } from './cameraCalculations';

// Store types - defined inline to avoid circular deps
interface LightState {
    enabled: boolean;
    color: string;
    intensity: number;
    position: { x: number; y: number; z: number };
}

interface LightingData {
    keyLight: LightState;
    fillLight: LightState;
    backLight: LightState;
    practicalLight: LightState;
    practicalType: string;
    volumetric: boolean;
    fogDensity: number;
    fogColor: string;
}

interface DepthLayer {
    description: string;
    fogDensity: number;
}

interface CompositionData {
    foreground: DepthLayer;
    midground: DepthLayer;
    background: DepthLayer;
    depthBlur: number;
    focusLayer: string;
}

interface MapCoords {
    lat: number;
    lng: number;
    placeName: string;
}

interface LocationData {
    mode: string;
    coordinates: MapCoords | null;
    earthLocation: string;
    customLocation: string;
    cosmicLocation: string;
    era: string;
    year: number;
    timeOfDay: string;
    weather: string;
    season: string;
    smartFilterEnabled: boolean;
}

export interface PromptBuilderOptions {
    camera: CameraAngles;
    scene: SceneSettings;
    lighting: LightingData;
    composition: CompositionData;
    location: LocationData;
}

// Contradiction pairs
const CONTRADICTIONS: [string, string][] = [
    ['night', 'noon'], ['night', 'morning'], ['midnight', 'golden hour'],
    ['midnight', 'dawn'], ['winter', 'summer'], ['snow', 'summer'],
    ['rain', 'clear sky'], ['indoor', 'outdoor'], ['space', 'earth'],
    ['underwater', 'desert'], ['ancient', 'cyberpunk'], ['prehistoric', 'modern'],
];

function applySmartFilter(prompt: string, enabled: boolean): string {
    if (!enabled) return prompt;
    let result = prompt;
    for (const [word1, word2] of CONTRADICTIONS) {
        if (result.toLowerCase().includes(word1) && result.toLowerCase().includes(word2)) {
            result = result.replace(new RegExp(`\\b${word2}\\b`, 'gi'), '');
        }
    }
    return result.replace(/,\s*,/g, ',').replace(/,\s*$/g, '').replace(/^\s*,/g, '').trim();
}

function buildLightingDescription(lighting: LightingData): string {
    const parts: string[] = [];

    if (lighting.keyLight.enabled) {
        const intensity = lighting.keyLight.intensity > 1 ? 'dramatic' :
            lighting.keyLight.intensity < 0.5 ? 'soft' : 'balanced';
        parts.push(`${intensity} key light`);
    }

    if (lighting.fillLight.enabled) {
        const ratio = lighting.keyLight.intensity / Math.max(0.1, lighting.fillLight.intensity);
        if (ratio > 3) parts.push('high contrast lighting');
        else if (ratio > 2) parts.push('cinematic lighting ratio');
        else parts.push('low contrast fill');
    }

    if (lighting.backLight.enabled) parts.push('rim lighting');

    if (lighting.practicalLight.enabled && lighting.practicalType !== 'none') {
        const descs: Record<string, string> = {
            'neon': 'neon light ambiance', 'candle': 'candlelight glow',
            'window': 'natural window light', 'screen': 'screen glow',
        };
        parts.push(descs[lighting.practicalType] || 'practical lighting');
    }

    if (lighting.volumetric) {
        if (lighting.fogDensity > 0.1) parts.push('heavy volumetric fog');
        else if (lighting.fogDensity > 0.05) parts.push('volumetric haze');
        else parts.push('atmospheric depth');
    }

    return parts.join(', ');
}

function buildCompositionDescription(comp: CompositionData): string {
    const parts: string[] = [];

    // Foreground
    if (comp.foreground.description?.trim()) {
        const fogDesc = comp.foreground.fogDensity > 50 ? 'hazy' :
            comp.foreground.fogDensity > 20 ? 'soft' : 'sharp';
        parts.push(`${comp.foreground.description.trim()} in ${fogDesc} foreground`);
    }

    // Midground
    if (comp.midground.description?.trim()) {
        parts.push(`${comp.midground.description.trim()} in midground`);
    }

    // Background  
    if (comp.background.description?.trim()) {
        const fogDesc = comp.background.fogDensity > 50 ? 'distant atmospheric' :
            comp.background.fogDensity > 20 ? 'hazy' : 'clear';
        parts.push(`${comp.background.description.trim()} in ${fogDesc} background`);
    }

    // Depth of field
    if (comp.depthBlur > 50) parts.push('shallow depth of field');
    else if (comp.depthBlur > 20) parts.push('moderate depth of field');

    return parts.join(', ');
}

function buildLocationTimeDescription(loc: LocationData): string {
    const parts: string[] = [];

    // Location from map coordinates
    if (loc.coordinates?.placeName) {
        parts.push(`in ${loc.coordinates.placeName}`);
    }
    // Location from Earth preset or custom
    else if (loc.mode === 'earth') {
        if (loc.customLocation?.trim()) {
            parts.push(`in ${loc.customLocation.trim()}`);
        } else if (loc.earthLocation) {
            const found = earthLocations.find(l => l.id === loc.earthLocation);
            if (found) parts.push(`in ${found.prompt}`);
        }
    }
    // Cosmic location
    else if (loc.mode === 'cosmic' && loc.cosmicLocation) {
        const found = cosmicLocations.find(l => l.id === loc.cosmicLocation);
        if (found) parts.push(found.prompt);
    }

    // Era
    const era = eras.find(e => e.id === loc.era);
    if (era && loc.era !== 'modern') {
        if (loc.year !== era.year) {
            const yearStr = loc.year < 0 ? `${Math.abs(loc.year)} BC` : `${loc.year} AD`;
            parts.push(`circa ${yearStr}`);
        } else {
            parts.push(era.prompt);
        }
    }

    // Time of day
    const time = timesOfDay.find(t => t.id === loc.timeOfDay);
    if (time?.prompt) parts.push(time.prompt);

    // Weather
    const weather = weatherOptions.find(w => w.id === loc.weather);
    if (weather?.prompt) parts.push(weather.prompt);

    // Season
    const season = seasons.find(s => s.id === loc.season);
    if (season && loc.season !== 'summer') parts.push(season.prompt);

    return parts.join(', ');
}

export function buildPrompt(options: PromptBuilderOptions): string {
    const { camera, scene, lighting, composition, location } = options;
    const segments: string[] = [];

    if (scene.charSheet) segments.push("<character_reference_image>");

    const angleDesc = getCameraAngleDescription(camera.azimuth, camera.elevation, camera.roll);
    segments.push(`${angleDesc} of ${scene.subject}`);

    const lensData = lenses.find(l => l.id === scene.lens);
    if (lensData) segments.push(`shot on ${lensData.name} lens`);

    // Composition - now passed directly
    const compDesc = buildCompositionDescription(composition);
    if (compDesc) segments.push(compDesc);

    // Location - now passed directly
    const locDesc = buildLocationTimeDescription(location);
    if (locDesc) segments.push(locDesc);

    if (!locDesc && scene.setting?.trim()) segments.push(`set in ${scene.setting}`);

    const lightDesc = buildLightingDescription(lighting);
    if (lightDesc) segments.push(lightDesc);

    const filmData = filmStocks.find(f => f.id === scene.filmStock);
    if (filmData) segments.push(filmData.prompt);

    segments.push("detailed textures, professional composition");
    segments.push(`--ar ${scene.aspectRatio}`);

    let prompt = segments.join(", ");
    return applySmartFilter(prompt, location.smartFilterEnabled);
}

export function buildPromptSegments(options: PromptBuilderOptions) {
    const { camera, scene, lighting, composition, location } = options;
    const segments: { type: string; content: string }[] = [];

    if (scene.charSheet) segments.push({ type: 'reference', content: '<character_reference_image>' });

    const angleDesc = getCameraAngleDescription(camera.azimuth, camera.elevation, camera.roll);
    segments.push({ type: 'subject', content: `${angleDesc} of ${scene.subject}` });

    const lensData = lenses.find(l => l.id === scene.lens);
    if (lensData) segments.push({ type: 'camera', content: `shot on ${lensData.name} lens` });

    const compDesc = buildCompositionDescription(composition);
    if (compDesc) segments.push({ type: 'composition', content: compDesc });

    const locDesc = buildLocationTimeDescription(location);
    if (locDesc) segments.push({ type: 'location', content: locDesc });

    if (!locDesc && scene.setting?.trim()) segments.push({ type: 'setting', content: `set in ${scene.setting}` });

    const lightDesc = buildLightingDescription(lighting);
    if (lightDesc) segments.push({ type: 'lighting', content: lightDesc });

    const filmData = filmStocks.find(f => f.id === scene.filmStock);
    if (filmData) segments.push({ type: 'quality', content: filmData.prompt });

    segments.push({ type: 'quality', content: 'detailed textures, professional composition' });
    segments.push({ type: 'parameters', content: `--ar ${scene.aspectRatio}` });

    return segments;
}

export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}
