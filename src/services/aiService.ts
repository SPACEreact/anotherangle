// Google Gemini AI Service - Simplified & Robust
const GEMINI_API_KEY = import.meta.env.VITE_API_KEY || '';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Debug: log if API key is loaded (remove in production)
console.log('[AI Service] API Key loaded:', GEMINI_API_KEY ? 'Yes (length: ' + GEMINI_API_KEY.length + ')' : 'NO - Check .env.local file');

export interface ImageAnalysis {
    foreground: string;
    midground: string;
    background: string;
    lighting: string;
    mood: string;
    timeOfDay: string;
    location: string;
}

export interface PromptEnhancement {
    enhanced: string;
    tips: string[];
}

/**
 * Analyze an image and extract composition details
 */
export async function analyzeImage(imageDataUrl: string): Promise<ImageAnalysis | null> {
    try {
        // Extract base64 data
        const base64Data = imageDataUrl.split(',')[1];
        if (!base64Data) return null;

        const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            text: `Analyze this image for AI image generation. Return ONLY valid JSON:
{"foreground":"elements in front","midground":"main subject","background":"distant elements","lighting":"lighting style","mood":"one word mood","timeOfDay":"dawn/day/dusk/night","location":"where this appears to be"}`
                        },
                        {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: base64Data
                            }
                        }
                    ]
                }]
            })
        });

        if (!res.ok) {
            console.error('Gemini API error:', res.status);
            return null;
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const match = text.match(/\{[\s\S]*\}/);

        if (match) {
            return JSON.parse(match[0]);
        }
        return null;
    } catch (err) {
        console.error('Image analysis failed:', err);
        return null;
    }
}

/**
 * Enhance a prompt with AI suggestions
 */
export async function enhancePrompt(prompt: string): Promise<PromptEnhancement | null> {
    try {
        const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Enhance this AI image prompt for better results:
"${prompt}"

Return ONLY valid JSON:
{"enhanced":"improved prompt text","tips":["tip 1","tip 2","tip 3"]}`
                    }]
                }]
            })
        });

        if (!res.ok) return null;

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const match = text.match(/\{[\s\S]*\}/);

        if (match) {
            return JSON.parse(match[0]);
        }
        return null;
    } catch (err) {
        console.error('Prompt enhance failed:', err);
        return null;
    }
}

/**
 * Get scene suggestions for a location
 */
export async function getSceneSuggestions(placeName: string): Promise<string[]> {
    try {
        const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Give 4 short cinematic scene descriptions for "${placeName}". Return ONLY a JSON array: ["scene 1","scene 2","scene 3","scene 4"]`
                    }]
                }]
            })
        });

        if (!res.ok) return [];

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const match = text.match(/\[[\s\S]*\]/);

        if (match) {
            return JSON.parse(match[0]);
        }
        return [];
    } catch (err) {
        console.error('Scene suggestions failed:', err);
        return [];
    }
}

/**
 * Parsed prompt data structure matching app stores
 */
export interface ParsedPrompt {
    subject?: string;
    setting?: string;
    lens?: string;
    aspectRatio?: string;
    filmStock?: string;
    cameraAngle?: {
        azimuth?: number;
        elevation?: number;
        roll?: number;
    };
    location?: {
        placeName?: string;
        timeOfDay?: string;
        weather?: string;
        season?: string;
        era?: string;
    };
    lighting?: {
        style?: string;
        volumetric?: boolean;
    };
    composition?: {
        foreground?: string;
        midground?: string;
        background?: string;
    };
}

/**
 * Parse a prompt string and extract settings using AI
 */
export async function parsePrompt(promptText: string): Promise<ParsedPrompt | null> {
    try {
        const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Analyze this AI image generation prompt and extract all settings. Return ONLY valid JSON matching this structure:
{
  "subject": "the main subject being described",
  "setting": "the scene/environment setting",
  "lens": "lens focal length like 16mm, 24mm, 35mm, 50mm, 85mm, 135mm, 200mm",
  "aspectRatio": "ratio like 1:1, 4:3, 16:9, 9:16, 21:9, 2.35:1",
  "filmStock": "film stock id: digital, kodak-portra, kodak-gold, fuji-velvia, fuji-superia, cinestill-800t, ilford-hp5, ilford-delta, polaroid",
  "cameraAngle": {
    "azimuth": "horizontal angle 0-360 (0=front, 90=left, 180=back, 270=right)",
    "elevation": "vertical angle -90 to 90 (negative=below, 0=eye level, positive=above)",
    "roll": "tilt angle -45 to 45"
  },
  "location": {
    "placeName": "specific location name if mentioned",
    "timeOfDay": "dawn, morning, noon, afternoon, goldenhour, dusk, night, midnight, bluehour",
    "weather": "clear, cloudy, rain, storm, snow, fog, sandstorm, aurora",
    "season": "spring, summer, autumn, winter",
    "era": "prehistoric, ancient_egypt, ancient_rome, medieval, renaissance, victorian, roaring20s, ww2, retro60s, synthwave80s, y2k, modern, nearfuture, cyberpunk, farfuture"
  },
  "lighting": {
    "style": "lighting style description",
    "volumetric": true/false
  },
  "composition": {
    "foreground": "foreground elements",
    "midground": "midground/main subject placement",
    "background": "background elements"
  }
}

Only include fields that are clearly present in the prompt. Leave out fields that cannot be determined.

Prompt to analyze:
"${promptText}"`
                    }]
                }]
            })
        });

        if (!res.ok) {
            console.error('Gemini API error:', res.status);
            return null;
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const match = text.match(/\{[\s\S]*\}/);

        if (match) {
            return JSON.parse(match[0]);
        }
        return null;
    } catch (err) {
        console.error('Prompt parsing failed:', err);
        return null;
    }
}
