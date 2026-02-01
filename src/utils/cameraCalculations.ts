import type { CameraAngles } from '../types';

/**
 * Get precise technical camera angle description for AI image generation
 * Uses cinematography terminology with exact degree specifications
 */
export function getCameraAngleDescription(
    azimuth: number,
    elevation: number,
    roll: number
): string {
    const parts: string[] = [];

    // Normalize Azimuth to 0-360
    const normAz = ((azimuth % 360) + 360) % 360;

    // === HORIZONTAL ANGLE (Azimuth) ===
    // Precise direction with degree notation
    if (normAz >= 350 || normAz <= 10) {
        parts.push("direct frontal shot at 0°");
    } else if (normAz > 10 && normAz <= 30) {
        parts.push(`slight 3/4 view at ${Math.round(normAz)}° offset`);
    } else if (normAz > 30 && normAz <= 45) {
        parts.push(`classic 3/4 angle at ${Math.round(normAz)}°`);
    } else if (normAz > 45 && normAz <= 60) {
        parts.push(`strong 3/4 profile at ${Math.round(normAz)}°`);
    } else if (normAz > 60 && normAz <= 80) {
        parts.push(`near-profile view at ${Math.round(normAz)}°`);
    } else if (normAz > 80 && normAz <= 100) {
        parts.push(`direct side profile at ${Math.round(normAz)}°`);
    } else if (normAz > 100 && normAz <= 135) {
        parts.push(`rear 3/4 view at ${Math.round(normAz)}°`);
    } else if (normAz > 135 && normAz <= 170) {
        parts.push(`over-the-shoulder angle at ${Math.round(normAz)}°`);
    } else if (normAz > 170 && normAz <= 190) {
        parts.push(`direct back view at 180°`);
    } else if (normAz > 190 && normAz <= 225) {
        parts.push(`reverse over-the-shoulder at ${Math.round(normAz)}°`);
    } else if (normAz > 225 && normAz <= 260) {
        parts.push(`opposing side profile at ${Math.round(normAz)}°`);
    } else if (normAz > 260 && normAz <= 280) {
        parts.push(`near-profile from left at ${Math.round(normAz)}°`);
    } else if (normAz > 280 && normAz <= 315) {
        parts.push(`3/4 view from left at ${Math.round(normAz)}°`);
    } else if (normAz > 315 && normAz < 350) {
        parts.push(`slight 3/4 from left at ${Math.round(normAz)}°`);
    }

    // === VERTICAL ANGLE (Elevation) ===
    // Precise camera height terminology
    if (elevation >= 80) {
        parts.push(`extreme overhead bird's eye at ${Math.round(elevation)}° downward`);
    } else if (elevation >= 60) {
        parts.push(`steep high angle at ${Math.round(elevation)}° downward, God's eye view`);
    } else if (elevation >= 45) {
        parts.push(`dramatic high angle at ${Math.round(elevation)}° looking down`);
    } else if (elevation >= 30) {
        parts.push(`moderate high angle at ${Math.round(elevation)}° above eye level`);
    } else if (elevation >= 15) {
        parts.push(`slight high angle at ${Math.round(elevation)}° elevation`);
    } else if (elevation >= -5 && elevation < 15) {
        parts.push(`eye level shot at ${Math.round(elevation)}°`);
    } else if (elevation >= -15 && elevation < -5) {
        parts.push(`slight low angle at ${Math.round(Math.abs(elevation))}° below eye level`);
    } else if (elevation >= -30 && elevation < -15) {
        parts.push(`moderate low angle at ${Math.round(Math.abs(elevation))}° upward`);
    } else if (elevation >= -45 && elevation < -30) {
        parts.push(`dramatic low angle hero shot at ${Math.round(Math.abs(elevation))}°`);
    } else if (elevation >= -60 && elevation < -45) {
        parts.push(`steep low angle at ${Math.round(Math.abs(elevation))}° looking up`);
    } else if (elevation < -60) {
        parts.push(`extreme worm's eye view at ${Math.round(Math.abs(elevation))}° from ground`);
    }

    // === ROLL (Dutch Angle) ===
    if (roll > 25 || roll < -25) {
        const dir = roll > 0 ? 'clockwise' : 'counter-clockwise';
        parts.push(`extreme dutch angle tilted ${Math.round(Math.abs(roll))}° ${dir}`);
    } else if (roll > 10 || roll < -10) {
        const dir = roll > 0 ? 'right' : 'left';
        parts.push(`dutch angle ${Math.round(Math.abs(roll))}° ${dir} tilt`);
    } else if (roll > 3 || roll < -3) {
        const dir = roll > 0 ? 'right' : 'left';
        parts.push(`subtle ${Math.round(Math.abs(roll))}° ${dir} tilt`);
    }

    // === SHOT TYPE CONTEXT ===
    // Add cinematographic shot type based on combined angles
    let shotType = '';
    if (elevation >= 60) {
        shotType = 'establishing overhead';
    } else if (elevation <= -45) {
        shotType = 'heroic power shot';
    } else if (Math.abs(roll) > 15) {
        shotType = 'tension-building';
    } else if (normAz > 160 && normAz < 200) {
        shotType = 'mystery back shot';
    } else if ((normAz > 40 && normAz < 50) || (normAz > 310 && normAz < 320)) {
        shotType = 'cinematic 3/4 portrait';
    }

    if (shotType) {
        parts.unshift(shotType);
    }

    return parts.join(', ');
}

/**
 * Get formatted angle display string
 */
export function getAngleDisplayString(azimuth: number, elevation: number, roll: number): string {
    return `Az: ${Math.round(azimuth)}° | El: ${Math.round(elevation)}° | Roll: ${Math.round(roll)}°`;
}

/**
 * Normalize angle to specified range
 */
export function normalizeAngle(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Get smooth easing for camera transitions
 */
export function easeInOutCubic(t: number): number {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
