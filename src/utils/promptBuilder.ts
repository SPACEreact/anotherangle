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
    universePoint: string;
    cameraVantage: string;
    cosmicEpochYear: number;
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

// ─── Color Utilities ───────────────────────────────────────────────────────────

/**
 * Convert a hex color to a descriptive color name for the prompt.
 */
function hexToColorName(hex: string): string {
    const colorMap: Record<string, string> = {
        '#ffffff': 'pure white',
        '#fff5e6': 'warm golden-white',
        '#e6f0ff': 'cool daylight blue',
        '#ff6b6b': 'crimson red',
        '#4ecdc4': 'teal cyan',
        '#ff00ff': 'vivid magenta',
        '#ffaa00': 'amber orange',
        '#00ff88': 'bright green',
        '#88aaff': 'soft blue',
        '#ffaa44': 'warm amber',
        '#ff9933': 'warm orange',
        '#aaccff': 'sky blue',
        '#00ffaa': 'electric mint',
    };

    const exact = colorMap[hex.toLowerCase()];
    if (exact) return exact;

    // Parse hex and determine color family
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lum = (max + min) / 2;

    if (max - min < 30) {
        if (lum > 200) return 'white';
        if (lum > 140) return 'light gray';
        if (lum > 80) return 'gray';
        return 'dark charcoal';
    }

    // Determine rough hue
    if (r > g && r > b) {
        if (g > 150) return 'warm golden';
        if (g > 80) return 'warm orange';
        return 'deep red';
    }
    if (g > r && g > b) {
        if (b > 150) return 'cyan-green';
        return 'green';
    }
    if (b > r && b > g) {
        if (r > 150) return 'lavender';
        if (r > 80) return 'violet';
        return 'deep blue';
    }
    if (r > 200 && g < 100 && b > 200) return 'magenta';
    if (r > 200 && g > 200 && b < 100) return 'golden yellow';

    return 'colored';
}

/**
 * Get color temperature description
 */
function getColorTemperature(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const diff = r - b;

    if (diff > 100) return 'warm-toned';
    if (diff > 40) return 'slightly warm';
    if (diff < -100) return 'cool-toned';
    if (diff < -40) return 'slightly cool';
    return 'neutral';
}

/**
 * Get intensity description with more granularity
 */
function getIntensityDesc(intensity: number): string {
    if (intensity >= 1.8) return 'blazing';
    if (intensity >= 1.4) return 'intense';
    if (intensity >= 1.0) return 'strong';
    if (intensity >= 0.7) return 'moderate';
    if (intensity >= 0.4) return 'gentle';
    if (intensity >= 0.2) return 'subtle';
    return 'faint';
}

// ─── Lighting Description Builder ──────────────────────────────────────────────

function buildLightingDescription(lighting: LightingData): string {
    const parts: string[] = [];

    if (lighting.keyLight.enabled) {
        const colorName = hexToColorName(lighting.keyLight.color);
        const intensityDesc = getIntensityDesc(lighting.keyLight.intensity);
        const tempDesc = getColorTemperature(lighting.keyLight.color);
        parts.push(`${intensityDesc} ${tempDesc} ${colorName} key light`);
    }

    if (lighting.fillLight.enabled) {
        const colorName = hexToColorName(lighting.fillLight.color);
        const ratio = lighting.keyLight.intensity / Math.max(0.1, lighting.fillLight.intensity);
        let contrastDesc: string;
        if (ratio > 4) contrastDesc = 'extreme contrast';
        else if (ratio > 3) contrastDesc = 'high contrast chiaroscuro';
        else if (ratio > 2) contrastDesc = 'cinematic contrast ratio';
        else if (ratio > 1.2) contrastDesc = 'moderate contrast';
        else contrastDesc = 'flat low-contrast';
        parts.push(`${colorName} fill light creating ${contrastDesc}`);
    }

    if (lighting.backLight.enabled) {
        const colorName = hexToColorName(lighting.backLight.color);
        const intensityDesc = getIntensityDesc(lighting.backLight.intensity);
        parts.push(`${intensityDesc} ${colorName} rim/back light`);
    }

    if (lighting.practicalLight.enabled && lighting.practicalType !== 'none') {
        const colorName = hexToColorName(lighting.practicalLight.color);
        const descs: Record<string, string> = {
            'neon': `${colorName} glowing colored light ambiance`,
            'candle': `warm ${colorName} flickering soft light`,
            'window': `${colorName} diffused directional light`,
            'screen': `cool ${colorName} electronic glow`,
        };
        parts.push(descs[lighting.practicalType] || `${colorName} practical lighting`);
    }

    if (lighting.volumetric) {
        const fogColorName = hexToColorName(lighting.fogColor);
        if (lighting.fogDensity > 0.1) parts.push(`heavy ${fogColorName} volumetric fog`);
        else if (lighting.fogDensity > 0.05) parts.push(`${fogColorName} volumetric haze`);
        else parts.push(`subtle ${fogColorName} atmospheric depth`);
    }

    return parts.join(', ');
}

// ─── Composition Description Builder ───────────────────────────────────────────

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

// ─── Location / Time Description Builder ───────────────────────────────────────

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

    if (loc.universePoint?.trim()) {
        parts.push(`observation point: ${loc.universePoint.trim()}`);
    }

    if (loc.cameraVantage?.trim()) {
        parts.push(`camera vantage: ${loc.cameraVantage.trim()}`);
    }

    if (loc.mode === 'cosmic' && Number.isFinite(loc.cosmicEpochYear)) {
        const epoch = Math.round(loc.cosmicEpochYear);
        const epochLabel = epoch < 0 ? `${Math.abs(epoch)} BCE` : `${epoch} CE`;
        parts.push(`cosmic epoch ${epochLabel}`);
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

// ─── Main Prompt Builder (4-Layer Cinematic Structure) ─────────────────────────

export function buildPrompt(options: PromptBuilderOptions): string {
    const { camera, scene, lighting, composition, location } = options;

    // ── No reference image: standard 4-layer cinematic generation prompt ──
    const layers: string[] = [];

    // LAYER 1: Core Action & Subject
    const layer1Parts: string[] = [];
    if (scene.subject?.trim()) layer1Parts.push(scene.subject.trim());
    if (scene.setting?.trim()) {
        const locDesc = buildLocationTimeDescription(location);
        if (!locDesc) {
            layer1Parts.push(`set in ${scene.setting.trim()}`);
        }
    }
    if (layer1Parts.length) layers.push(layer1Parts.join(', '));

    // LAYER 2: Spatial & Color Structure
    const layer2Parts: string[] = [];
    const compDesc = buildCompositionDescription(composition);
    if (compDesc) layer2Parts.push(compDesc);
    const locDesc = buildLocationTimeDescription(location);
    if (locDesc) layer2Parts.push(locDesc);
    if (layer2Parts.length) layers.push(layer2Parts.join(', '));

    // LAYER 3: Lighting & Atmosphere
    const lightDesc = buildLightingDescription(lighting);
    if (lightDesc) layers.push(lightDesc);

    // LAYER 4: Technical Specs
    const layer4Parts: string[] = [];
    const angleDesc = getCameraAngleDescription(camera.azimuth, camera.elevation, camera.roll);
    layer4Parts.push(`camera positioned at ${angleDesc}`);
    const lensData = lenses.find(l => l.id === scene.lens);
    if (lensData) layer4Parts.push(`shot on ${lensData.name} lens`);
    const filmData = filmStocks.find(f => f.id === scene.filmStock);
    if (filmData) layer4Parts.push(filmData.prompt);
    layer4Parts.push("detailed textures, professional cinematic composition");
    layer4Parts.push(`--ar ${scene.aspectRatio}`);
    layers.push(layer4Parts.join(', '));

    const prompt = layers.join('. ');
    return applySmartFilter(prompt, location.smartFilterEnabled);
}

export function buildPromptSegments(options: PromptBuilderOptions) {
    const { camera, scene, lighting, composition, location } = options;
    const segments: { type: string; content: string }[] = [];
    // Subject
    if (scene.subject?.trim()) {
        segments.push({ type: 'subject', content: scene.subject.trim() });
    }

    // Setting/Location
    const locDesc = buildLocationTimeDescription(location);
    if (locDesc) {
        segments.push({ type: 'location', content: locDesc });
    } else if (scene.setting?.trim()) {
        segments.push({ type: 'location', content: `set in ${scene.setting.trim()}` });
    }

    // Composition
    const compDesc = buildCompositionDescription(composition);
    if (compDesc) {
        segments.push({ type: 'composition', content: compDesc });
    }

    // Lighting
    const lightDesc = buildLightingDescription(lighting);
    if (lightDesc) {
        segments.push({ type: 'lighting', content: lightDesc });
    }

    // Camera angle
    const angleDesc = getCameraAngleDescription(camera.azimuth, camera.elevation, camera.roll);
    segments.push({ type: 'camera', content: `camera positioned at ${angleDesc}` });

    // Lens
    const lensData = lenses.find(l => l.id === scene.lens);
    if (lensData) {
        segments.push({ type: 'camera', content: `shot on ${lensData.name} lens` });
    }

    // Film stock
    const filmData = filmStocks.find(f => f.id === scene.filmStock);
    if (filmData) {
        segments.push({ type: 'quality', content: filmData.prompt });
    }

    segments.push({ type: 'quality', content: 'detailed textures, professional cinematic composition' });
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
