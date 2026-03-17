import { create } from 'zustand';

function describeRange(val: number, low: string, mid: string, high: string): string {
  if (val < 30) return low;
  if (val < 70) return mid;
  return high;
}

export interface EditorState {
  // Subject & Action
  subject: string;
  action: string;
  motionSpeed: number;
  motionDir: string;

  // Camera
  shotType: string;
  camMove: string;
  lens: string;
  dof: number;

  // Lighting
  lightSrc: string;
  lightDir: string;
  lightInt: number;
  shadowH: number;
  lightColor: string;

  // Mood & Color Grading
  moods: string[];
  grades: string[];

  // Visual Style
  style: string;
  grain: number;
  sat: number;
  cont: number;
  colorTemp: number;

  // Environment
  env: string;
  tod: string;
  weather: string;

  // Detail
  sharp: number;
  tex: number;
  mblur: number;

  // Negative
  neg: string;

  // Image upload
  imageDataUrl: string | null;
  isAnalyzing: boolean;

  // Actions
  set: (partial: Partial<EditorState>) => void;
  toggleMood: (mood: string) => void;
  toggleGrade: (grade: string) => void;
  setImageDataUrl: (url: string | null) => void;
  setIsAnalyzing: (v: boolean) => void;
  buildPrompt: () => string;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  subject: '',
  action: '',
  motionSpeed: 40,
  motionDir: 'none',

  shotType: 'medium shot',
  camMove: 'static',
  lens: '50mm',
  dof: 60,

  lightSrc: 'natural daylight',
  lightDir: 'side lit',
  lightInt: 65,
  shadowH: 50,
  lightColor: '#fff5e0',

  moods: [],
  grades: [],

  style: 'photorealistic',
  grain: 20,
  sat: 55,
  cont: 55,
  colorTemp: 50,

  env: '',
  tod: 'afternoon',
  weather: 'clear',

  sharp: 70,
  tex: 65,
  mblur: 10,

  neg: '',

  imageDataUrl: null,
  isAnalyzing: false,

  set: (partial) => set(partial),
  toggleMood: (mood) =>
    set((s) => ({
      moods: s.moods.includes(mood) ? s.moods.filter((m) => m !== mood) : [...s.moods, mood],
    })),
  toggleGrade: (grade) =>
    set((s) => ({
      grades: s.grades.includes(grade) ? s.grades.filter((g) => g !== grade) : [...s.grades, grade],
    })),
  setImageDataUrl: (url) => set({ imageDataUrl: url }),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),

  buildPrompt: () => {
    const s = get();
    const parts: string[] = [];

    // Subject
    if (s.subject.trim()) parts.push(`${s.subject.trim()}.`);

    // Action & Motion
    if (s.action.trim()) {
      let motDesc = '';
      if (s.motionSpeed < 30) motDesc = 'very slowly ';
      else if (s.motionSpeed > 70) motDesc = 'rapidly ';
      const dirDesc = s.motionDir !== 'none' ? `, moving ${s.motionDir}` : '';
      parts.push(`${motDesc}${s.action.trim()}${dirDesc}.`);
    }

    // Camera
    parts.push(`${s.shotType}, shot on ${s.lens} lens.`);
    const dofDesc = describeRange(s.dof, 'shallow depth of field, subject isolated with creamy bokeh', 'moderate depth of field', 'deep focus, entire scene sharp');
    parts.push(dofDesc + '.');
    if (s.camMove !== 'static') parts.push(`Camera ${s.camMove}.`);

    // Lighting
    const lightIntDesc = describeRange(s.lightInt, 'dim, low-key lighting', 'moderate, balanced lighting', 'high-key, bright lighting');
    const shadowDesc = describeRange(s.shadowH, 'soft diffused shadows', 'moderate shadows', 'hard sharp shadows');
    const colorDesc = s.lightColor !== '#ffffff' && s.lightColor !== '#fff5e0' ? `, light colored ${s.lightColor}` : '';
    parts.push(`Lit by ${s.lightSrc}, ${s.lightDir}, ${lightIntDesc}, ${shadowDesc}${colorDesc}.`);

    // Environment
    if (s.env.trim()) {
      parts.push(`Set in ${s.env.trim()}, ${s.tod}${s.weather !== 'clear' ? ', ' + s.weather + ' weather' : ''}.`);
    } else {
      parts.push(`Time: ${s.tod}${s.weather !== 'clear' ? ', ' + s.weather : ''}.`);
    }

    // Color & Style
    const satDesc = describeRange(s.sat, 'desaturated muted tones', 'natural saturation', 'vivid heavily saturated colors');
    const contDesc = describeRange(s.cont, 'low contrast flat look', 'balanced contrast', 'high contrast punchy look');
    const tempDesc = describeRange(s.colorTemp, 'cool blue color temperature', 'neutral color temperature', 'warm orange color temperature');
    parts.push(`${satDesc}, ${contDesc}, ${tempDesc}.`);

    if (s.grades.length) parts.push(`Color graded with ${s.grades.join(', ')}.`);

    parts.push(`${s.style} style.`);
    if (s.grain > 40) parts.push(`${describeRange(s.grain, '', 'moderate film grain', 'heavy film grain')}.`);

    // Detail
    const sharpDesc = describeRange(s.sharp, 'soft focus', 'standard sharpness', 'ultra sharp hyper-detailed');
    if (s.tex > 50) parts.push(`${describeRange(s.tex, '', 'detailed surface textures', 'extreme micro-detail on every surface')}.`);
    parts.push(`${sharpDesc}.`);
    if (s.mblur > 20) parts.push(`${describeRange(s.mblur, '', 'subtle motion blur', 'heavy motion blur on moving elements')}.`);

    // Mood
    if (s.moods.length) parts.push(`${s.moods.join(', ')} mood.`);

    // Negative
    if (s.neg.trim()) parts.push(`\n--no ${s.neg.trim()}`);

    return parts.join(' ');
  },
}));
