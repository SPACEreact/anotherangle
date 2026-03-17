// Google Gemini AI Service — Image Analysis (OCR) & Prompt Enhancement
const GEMINI_API_KEY = import.meta.env.VITE_API_KEY || '';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

console.log('[AI Service] API Key loaded:', GEMINI_API_KEY ? 'Yes' : 'NO — Check .env.local file');

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
 * Analyze an uploaded image using Gemini vision — extracts composition details
 * to auto-fill the editor fields (Subject, Environment, Lighting, Mood, etc.)
 */
export async function analyzeImage(imageDataUrl: string): Promise<ImageAnalysis | null> {
  try {
    const base64Data = imageDataUrl.split(',')[1];
    if (!base64Data) return null;

    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `You are a cinematographer analyzing this image to recreate its composition in an AI image generator.

Describe each element as if writing an AI image generation prompt — use visual, descriptive language.

Return ONLY valid JSON:
{
  "foreground":"describe foreground elements for AI recreation",
  "midground":"describe the main subject/action compositionally",
  "background":"describe background elements",
  "lighting":"describe lighting setup using tonal/technical terms",
  "mood":"one word mood",
  "timeOfDay":"dawn/morning/afternoon/dusk/night",
  "location":"the type of environment/setting"
}`
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
 * Enhance a prompt with AI — improves descriptive quality for image generation
 */
export async function enhancePrompt(prompt: string): Promise<PromptEnhancement | null> {
  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert at writing prompts for AI image generators (Midjourney, DALL-E, Stable Diffusion).

Enhance this prompt by improving its descriptive quality. Do NOT add or remove subjects/objects/elements.
Only refine: word choice, visual specificity, lighting precision, texture descriptions, cinematic terminology.

Original prompt:
"${prompt}"

Return ONLY valid JSON:
{"enhanced":"the refined prompt","tips":["tip 1","tip 2","tip 3"]}`
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
 * Intelligent Hierarchy Synthesis 
 * Uses Gemini to organically combine the literal settings, the reference images,
 * and the Core Emotion, actively resolving contradictions (e.g. bright image vs Despair).
 */
export async function generateIntelligentPrompt(
  basePrompt: string, 
  emotion: string, 
  imageUrls: string[] = []
): Promise<string | null> {
  try {
    const parts: any[] = [
      {
        text: `You are an elite Director of Photography and AI Prompt Engineer writing for Native Banana 2 / Midjourney.
        
Your task is to synthesize a single, organic, highly-descriptive prompt paragraph. 
The absolute driving force of this scene is the EMOTION: "${emotion}".
        
Here are the user's base technical requests:
"${basePrompt}"

CRITICAL INSTRUCTION: INTELLIGENT HIERARCHY
The EMOTION is the top of the hierarchy. If the user's technical requests OR the uploaded reference images contradict the EMOTION, you MUST creatively resolve the contradiction in favor of the EMOTION.
For example, if the emotion is "Despair" but the lighting is set to "bright high-key" or the reference image is sunny, you should rewrite the prompt to plunge that sunny scene into oppressive darkness or stark isolation.
DO NOT use literal metadata tags like "Visual Pressure: 8". Describe the spatial compression, lens distortion, and atmosphere organically as a director would.

Return ONLY the synthesized prompt text, nothing else. No markdown formatting, just the raw text paragraph.`
      }
    ];

    // Append up to 3 images to give context, to save bandwidth/tokens
    // We only need a few to understand the general contradiction content
    const imgLimit = Math.min(imageUrls.length, 3);
    for (let i = 0; i < imgLimit; i++) {
        const base64Data = imageUrls[i].split(',')[1];
        if (base64Data) {
            parts.push({
                inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Data
                }
            });
        }
    }

    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }]
      })
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text.replace(/^"|"$/g, '').trim(); 
  } catch (err) {
    console.error('Intelligent synthesis failed:', err);
    return null;
  }
}
