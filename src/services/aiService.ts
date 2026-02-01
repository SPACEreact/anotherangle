// Google Gemini AI Service - Simplified & Robust
const GEMINI_API_KEY = 'AIzaSyAU695i1Apsq5X-geQRp7lAdDsmDOfHOSc';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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
