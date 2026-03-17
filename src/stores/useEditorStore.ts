import { create } from 'zustand';

function describeRange(val: number, low: string, mid: string, high: string): string {
  if (val < 30) return low;
  if (val < 70) return mid;
  return high;
}

// Rich style descriptions that actually tell image models what to render
const STYLE_PROMPTS: Record<string, string> = {
  'photorealistic': 'photorealistic, ultra-realistic photograph, indistinguishable from a real photo, natural skin texture and pores visible',
  'cinematic film grain': 'cinematic still frame, 35mm Kodak film stock, visible film grain, anamorphic lens flare, color grading like a Hollywood blockbuster',
  'analog / 35mm': 'shot on analog 35mm film, visible grain and halation, slightly faded colors, authentic film photography aesthetic',
  'hyperreal': 'hyperrealistic, surreal level of detail, every texture amplified beyond reality, uncanny sharpness',
  'painterly': 'digital painting style, visible brushstrokes, painterly rendering with rich impasto texture, fine art quality',
  'graphic novel': 'graphic novel illustration, bold ink outlines, cel-shaded coloring, comic book panel aesthetic, high contrast inking',
  'anime': 'anime style illustration, clean line art, cel-shaded, vibrant anime color palette, Studio Ghibli-inspired rendering',
  '3D render': 'Pixar-quality 3D render, subsurface scattering on skin, global illumination, ray-traced reflections, Octane render',
  'claymation': 'claymation stop-motion style, everything made of sculpted clay and plasticine, visible fingerprint textures on surfaces, tactile matte materials, Laika Studios quality',
  'watercolor': 'watercolor painting, soft wet-on-wet blending, pigment granulation visible, paper texture showing through, translucent washes of color',
  'oil painting': 'oil painting on canvas, thick impasto brushwork, rich saturated pigments, visible canvas weave texture, Old Masters technique',
  'noir': 'film noir style, stark black and white, dramatic chiaroscuro lighting, deep shadows, 1940s detective movie aesthetic',
  'cyberpunk': 'cyberpunk aesthetic, neon-drenched, rain-slicked surfaces reflecting holographic advertisements, Blade Runner 2049 visual style',
  'vintage photograph': 'vintage photograph from the 1970s, warm faded colors, slight vignetting, Kodachrome color palette, analog warmth',
  'pastel illustration': 'soft pastel illustration, chalky muted tones, gentle gradients, dreamy ethereal quality, children\'s book art style',
  'dark fantasy': 'dark fantasy art, moody atmosphere, medieval aesthetic, muted earth tones with deep shadows, concept art quality',
  'surrealism': 'surrealist artwork in the style of Salvador Dalí, dreamlike impossible geometry, melting forms, hyperdetailed yet otherworldly',
  'pixel art': 'pixel art style, retro 16-bit game aesthetic, carefully placed pixels, limited color palette, nostalgic game art',
  'ukiyo-e': 'traditional Japanese ukiyo-e woodblock print style, flat color areas, bold outlines, wave patterns, Hokusai-inspired',
  'art nouveau': 'Art Nouveau style, flowing organic curves, ornate decorative borders, Alphonse Mucha-inspired, sinuous natural forms',
  'vaporwave': 'vaporwave aesthetic, pastel pinks and cyans, glitch effects, retro computer graphics, marble busts and palm trees',
};

// Time of day with rich environmental descriptions
const TOD_PROMPTS: Record<string, string> = {
  'dawn': 'at dawn, first light breaking over the horizon, sky gradient from deep indigo to pale gold, long horizontal shadows',
  'sunrise': 'during sunrise, golden-pink light flooding the scene, long warm shadows stretching across surfaces, sky ablaze with orange and magenta',
  'early morning': 'in early morning light, crisp cool-toned illumination, dew visible on surfaces, world freshly lit',
  'morning': 'in bright morning light, clean directional sunlight from a low angle, sharp clear shadows, fresh daylight',
  'noon': 'at high noon, overhead sun creating minimal shadows, even bright illumination, washed-out highlights',
  'afternoon': 'in warm afternoon light, sun at 45 degrees casting defined shadows, golden-tinted daylight',
  'golden hour': 'during golden hour, everything bathed in rich warm amber light, long dramatic shadows, sun low on the horizon casting a cinematic glow',
  'sunset': 'at sunset, sky painted in deep oranges, magentas and purples, rim light on every edge, last rays of warm light',
  'blue hour': 'during blue hour, entire scene washed in deep cobalt blue twilight, city lights just beginning to glow, ethereal ambient light',
  'dusk': 'at dusk, fading light on the horizon, scene transitioning to cool blue-purple tones, artificial lights starting to flicker on',
  'twilight': 'during twilight, deep purple and navy sky, ambient reflected light from below the horizon, mysterious crepuscular atmosphere',
  'night': 'at night, dark scene lit only by artificial sources, deep shadows, pools of light from streetlamps or windows',
  'midnight': 'at midnight, near-total darkness with isolated light sources, extreme contrast between light and shadow, noir atmosphere',
  'moonlit night': 'on a moonlit night, cool silvery-blue moonlight casting subtle shadows, ethereal nocturnal glow, stars visible',
};

// Weather with strong visual descriptions
const WEATHER_PROMPTS: Record<string, string> = {
  'clear': '',
  'partly cloudy': 'partly cloudy sky with dramatic cloud formations, dappled light filtering through breaks in the clouds',
  'overcast': 'under overcast sky, soft diffused light with no harsh shadows, flat even illumination, grey cloud ceiling',
  'fog': 'shrouded in fog, atmospheric haze softening all edges, limited visibility, objects fading into white mist',
  'heavy fog': 'engulfed in dense heavy fog, visibility under 20 meters, headlights creating cones of light in the mist, ghostly silhouettes',
  'light rain': 'during light rain, fine droplets visible in the air, wet reflective surfaces, subtle rain streaks in the light',
  'rain': 'in pouring rain, rain streaks visible in the air, puddles reflecting lights, wet glistening surfaces, water droplets on everything',
  'heavy rain': 'in torrential downpour, sheets of rain, splashing puddles, mist rising from wet ground, water cascading off surfaces',
  'storm': 'during a dramatic thunderstorm, lightning illuminating dark clouds, rain lashing the scene, wind-blown elements',
  'snow': 'during gentle snowfall, snowflakes drifting through the air, fresh white snow covering surfaces, cold blue-white atmosphere',
  'blizzard': 'in a blizzard, violently blowing snow reducing visibility, white-out conditions, harsh frozen atmosphere',
  'heat haze': 'with visible heat haze, refractive shimmer rising from hot surfaces distorting the background, scorching atmosphere',
  'dust storm': 'in a dust storm, thick ochre-orange haze filling the air, particles visible in light beams, apocalyptic atmosphere',
  'aurora': 'under northern lights, vibrant green and purple aurora borealis rippling across the sky, ethereal cosmic glow reflecting on surfaces',
  'misty': 'in early morning mist, low-lying ground fog, ethereal atmosphere, objects emerging from and fading into delicate haze',
  'windy': 'on a windy day, hair and fabrics blowing, dust and leaves carried in the air, sense of dynamic movement',
};

// ── CINEMATIC PSYCHOLOGY (DOP SYSTEM) ──

const EMOTION_PROMPTS: Record<string, string> = {
  'Grief': 'flat diffused light, 85–135mm, static, hold 2 beats too long, room tone amplified',
  'Melancholy': 'diffused daylight, 50–85mm shallow focus, subtle lateral drift',
  'Despair': 'low ceiling, underexposed mids, 18mm wide close — barrel distortion, slow push in',
  'Euphoria': 'open sky dominant, backlight bloom, wider lens slight overexposure, floating camera movement',
  'Anticipation': 'frame weighted toward empty side, deep focus, directional shadow, slow creep',
  'Dread': 'negative depth behind subject, hard single source, wide foreground intrusion, static',
  'Shame': 'partial obstruction, half-face shadow, 85mm close-up, camera lowers subtly',
  'Pride (Earned)': 'subject stands taller, subtle edge light, 35–50mm neutral, slow push forward',
  'Arrogance': 'low angle dominance, hard top light, 28mm wide, controlled push',
  'Jealousy': 'subject foreground, desired object background, split lighting, deep focus both planes, lateral shift',
  'Nostalgia': 'warm hazy backlight, soft filtration, gentle dolly, slow fades',
  'Awe': 'subject tiny vs environment, high contrast sunlight, 14mm deep focus, tilt up, slow reveal',
  'Confusion': 'cluttered frame, mixed color temps, wide with motion blur, uneven handheld',
  'Relief': 'frame opens, brightness increases, slightly wider lens, exhale push out, cut to stillness',
  'Betrayal': 'separation shadows, 135mm isolation, slow push on betrayed face',
  'Determination': 'centered frame, strong 45° key light, locked tripod',
  'Obsession': 'extreme close-ups, chiaroscuro, foreground object dominates',
  'Serenity': 'symmetry, even exposure, deep focus, static or slow pan, natural ambience',
  'Alienation': 'cool tones, 100mm flattening, lateral tracking',
  'Hope (Active)': 'path or opening ahead, backlight grows, wider deeper focus, forward tracking',
  'Regret': 'mirror or reflective surface, low key, medium close-up, slow inward drift',
  'Paranoia': 'background activity sharp, moving shadows, deep focus wide, constant micro-adjustment',
  'Triumph': 'vertical lift composition, hard backlight flare, slight wide low angle',
  'Emptiness': 'balanced but lifeless, neutral flat light, static medium shot, no movement',
};

const PRESSURE_PROMPTS: Record<number, string> = {
  1: 'Visual Pressure 1: Balanced, natural spatial relationship, zero distortion.',
  2: 'Visual Pressure 2: Slightly off-center framing, extended takes.',
  3: 'Visual Pressure 3: Directional light weighting negative space, slow structural push begins.',
  4: 'Visual Pressure 4: Frame tightens, telephoto compression introduced.',
  5: 'Visual Pressure 5: Subject separated, shallow DOF, strong key with deep shadows, handheld micro-movements.',
  6: 'Visual Pressure 6: Established rhythm disrupted, unexpected camera angle.',
  7: 'Visual Pressure 7: Extreme close-ups, wide lens distortion at close range, foreground intrusion.',
  8: 'Visual Pressure 8: Time stretches or compresses, absolute subjective detachment.',
  9: 'Visual Pressure 9: Multiple competing elements, aggressive handheld, severe Dutch angles.',
  10: 'Visual Pressure 10: Absolute maximum distortion, all grammar intentionally broken, or absolute terrifying stillness after chaos.',
};

export interface EditorState {
  subject: string;
  action: string;
  motionSpeed: number;
  motionDir: string;
  shotType: string;
  camMove: string;
  lens: string;
  dof: number;
  lightSrc: string;
  lightDir: string;
  lightInt: number;
  shadowH: number;
  lightColor: string;
  moods: string[];
  grades: string[];
  style: string;
  grain: number;
  sat: number;
  cont: number;
  colorTemp: number;
  env: string;
  tod: string;
  weather: string;
  sharp: number;
  tex: number;
  mblur: number;

  // Cinematic Psychology
  coreEmotion: string;
  pressureLevel: number;
  anchorObject: string;
  anchorPurpose: string;
  antiCliche: boolean;

  // Typography
  textNode: string;
  textStyle: string;
  textPlacement: string;
  textRotoscope: boolean;

  // Composition
  compRule: string;
  framing: string;

  // Advanced Optics
  aperture: string;
  filmStock: string;
  opticsEffects: string[];

  // Physics & Lighting
  globalIllum: boolean;
  volumetrics: string;
  materialPhysics: string[];

  // Negative
  neg: string;

  // Image upload
  referenceImages: string[];
  isAnalyzing: boolean;
  
  set: (partial: Partial<EditorState>) => void;
  toggleMood: (mood: string) => void;
  toggleGrade: (grade: string) => void;
  toggleOptics: (effect: string) => void;
  togglePhysics: (effect: string) => void;
  
  addReferenceImage: (url: string) => void;
  removeReferenceImage: (index: number) => void;
  setIsAnalyzing: (v: boolean) => void;
  buildPrompt: () => string;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  subject: '',
  action: '',
  motionSpeed: 40,
  motionDir: 'none',

  coreEmotion: 'None',
  pressureLevel: 1,
  anchorObject: '',
  anchorPurpose: 'unspecified',
  antiCliche: false,

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

  textNode: '',
  textStyle: 'neon sign',
  textPlacement: 'centered',
  textRotoscope: false,

  compRule: 'unspecified',
  framing: 'unspecified',

  aperture: 'f/4',
  filmStock: 'none',
  opticsEffects: [],

  globalIllum: false,
  volumetrics: 'none',
  materialPhysics: [],

  neg: '',

  referenceImages: [],
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
  toggleOptics: (effect) =>
    set((s) => ({
      opticsEffects: s.opticsEffects.includes(effect) ? s.opticsEffects.filter((e) => e !== effect) : [...s.opticsEffects, effect],
    })),
  togglePhysics: (effect) =>
    set((s) => ({
      materialPhysics: s.materialPhysics.includes(effect) ? s.materialPhysics.filter((e) => e !== effect) : [...s.materialPhysics, effect],
    })),
  addReferenceImage: (url) => 
    set((s) => {
      if (s.referenceImages.length >= 14) return s; // NB2 supports up to 14
      return { referenceImages: [...s.referenceImages, url] }
    }),
  removeReferenceImage: (index) =>
    set((s) => ({
      referenceImages: s.referenceImages.filter((_, i) => i !== index)
    })),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),

  buildPrompt: () => {
    const s = get();
    const parts: string[] = [];

    // ── CINEMATIC PSYCHOLOGY & THEME ──
    if (s.coreEmotion !== 'None' && EMOTION_PROMPTS[s.coreEmotion]) {
      let psych = `CINEMATIC PSYCHOLOGY: Driven by ${s.coreEmotion.toUpperCase()}. Visual grammar applied: ${EMOTION_PROMPTS[s.coreEmotion]}.`;
      if (s.antiCliche) {
        psych += ' ANTI-CLICHÉ MODE ACTIVE: Subvert expected visual tropes for this emotion (e.g., bright indifference applied to dark themes).';
      }
      parts.push(psych);
    }

    if (s.pressureLevel > 1) {
      parts.push(PRESSURE_PROMPTS[s.pressureLevel] || '');
    }

    // ── NAREATIVE ANCHOR ("Every Object is Evidence") ──
    if (s.anchorObject.trim() && s.anchorPurpose !== 'unspecified') {
      parts.push(`NARRATIVE ANCHOR: Include the specific object "${s.anchorObject.trim()}" in the frame to serve as ${s.anchorPurpose}. Nothing is decorative; this object is evidence of the subtext.`);
    }

    // ── SUBJECT ──
    if (s.subject.trim()) {
      parts.push(s.subject.trim());
    }

    // ── ACTION & MOTION ──
    if (s.action.trim()) {
      let motDesc = '';
      if (s.motionSpeed < 30) motDesc = 'in slow motion, ';
      else if (s.motionSpeed > 70) motDesc = 'in rapid motion, ';
      const dirDesc = s.motionDir !== 'none' ? `, moving ${s.motionDir}` : '';
      parts.push(`${motDesc}${s.action.trim()}${dirDesc}`);
    }

    // ── CAMERA ──
    // Lens with character description
    const lensNum = parseInt(s.lens);
    let lensDesc = `shot on ${s.lens} lens`;
    if (lensNum <= 18) lensDesc += ', ultra-wide perspective with dramatic barrel distortion';
    else if (lensNum <= 28) lensDesc += ', wide-angle with environmental context and slight perspective exaggeration';
    else if (lensNum <= 40) lensDesc += ', natural field of view, documentary-like perspective';
    else if (lensNum <= 55) lensDesc += ', natural human-eye perspective, no distortion';
    else if (lensNum <= 100) lensDesc += ', portrait-length compression, beautiful subject separation from background';
    else if (lensNum <= 200) lensDesc += ', telephoto compression flattening depth, stacked background elements';
    else lensDesc += ', extreme telephoto compression, severely flattened perspective, distant subject isolation';

    parts.push(`${s.shotType} framing, ${lensDesc}`);

    // Optics & Film Stock
    if (s.aperture !== 'unspecified') parts.push(`shot wide open at ${s.aperture}`);
    if (s.filmStock !== 'none') parts.push(`shot on ${s.filmStock} film stock`);
    if (s.opticsEffects.length) parts.push(`optical properties: ${s.opticsEffects.join(', ')}`);

    // DOF
    const dofDesc = describeRange(
      s.dof,
      'extremely shallow depth of field with creamy bokeh, subject razor-sharp against a heavily blurred background',
      'moderate depth of field, subject in focus with soft background separation',
      'deep focus, entire scene rendered tack-sharp from near to far'
    );
    parts.push(dofDesc);

    if (s.camMove !== 'static') {
      parts.push(`camera performing a ${s.camMove}`);
    }

    // ── COMPOSITION ──
    if (s.compRule !== 'unspecified') parts.push(`composition follows ${s.compRule}`);
    if (s.framing !== 'unspecified') parts.push(`framed with ${s.framing}`);

    // ── LIGHTING — strong directive language ──
    const lightIntDesc = describeRange(
      s.lightInt,
      'dim low-key lighting with deep shadows dominating the frame',
      'balanced mid-key lighting with natural tonal range',
      'bright high-key lighting flooding the scene, minimal shadows, airy feel'
    );
    const shadowDesc = describeRange(
      s.shadowH,
      'with soft diffused shadow edges, gentle shadow transitions',
      'with moderate shadow definition',
      'with razor-sharp hard-edged shadows, high contrast light-to-shadow transitions'
    );
    const colorDesc = s.lightColor !== '#ffffff' && s.lightColor !== '#fff5e0'
      ? `, light source tinted ${s.lightColor}`
      : '';
    let physLightDesc = '';
    if (s.globalIllum) physLightDesc += ' with global illumination and bounced ambient light';
    if (s.volumetrics !== 'none') physLightDesc += `, ${s.volumetrics} atmosphere`;
    
    parts.push(`${lightIntDesc}, lit by ${s.lightSrc}, ${s.lightDir} ${shadowDesc}${colorDesc}${physLightDesc}`);

    // ── MATERIAL PHYSICS ──
    if (s.materialPhysics.length) {
      parts.push(`physical material rendering: ${s.materialPhysics.join(', ')}`);
    }

    // ── TIME OF DAY — always prominent ──
    const todPrompt = TOD_PROMPTS[s.tod] || `${s.tod}`;
    parts.push(todPrompt);

    // ── WEATHER — when not clear, strong visual presence ──
    const weatherPrompt = WEATHER_PROMPTS[s.weather] || '';
    if (weatherPrompt) parts.push(weatherPrompt);

    // ── ENVIRONMENT ──
    if (s.env.trim()) {
      parts.push(`set in ${s.env.trim()}`);
    }

    // ── MOOD ──
    if (s.moods.length) {
      parts.push(`${s.moods.join(' and ')} atmosphere, evoking a deep sense of ${s.moods[0]}`);
    }

    // ── VISUAL STYLE — use the rich description ──
    const stylePrompt = STYLE_PROMPTS[s.style] || s.style;
    parts.push(stylePrompt);

    // ── COLOR GRADING ──
    const satDesc = describeRange(s.sat, 'highly desaturated, nearly monochromatic muted tones', 'natural true-to-life saturation', 'hyper-saturated vivid colors, punchy and eye-catching');
    const contDesc = describeRange(s.cont, 'low contrast flat pastel look, lifted blacks', 'balanced natural contrast', 'high contrast, deep crushed blacks and bright highlights, dramatic tonal range');
    const tempDesc = describeRange(s.colorTemp, 'cool blue-shifted color temperature, icy cold tones throughout', 'neutral balanced color temperature', 'warm orange-shifted color temperature, cozy golden tones throughout');
    parts.push(`${satDesc}, ${contDesc}, ${tempDesc}`);

    if (s.grades.length) {
      parts.push(`color graded with ${s.grades.join(' and ')} look`);
    }

    if (s.grain > 40) {
      parts.push(describeRange(s.grain, '', 'subtle film grain texture visible', 'heavy visible film grain texture, analog noise pattern covering the image'));
    }

    // ── DETAIL LEVEL ──
    const sharpDesc = describeRange(s.sharp, 'soft dreamy focus, slightly diffused edges', 'naturally sharp with standard detail clarity', 'razor-sharp ultra-detailed, every pore and fiber visible in 8K clarity');
    parts.push(sharpDesc);

    if (s.tex > 50) {
      parts.push(describeRange(s.tex, '', 'rich surface textures visible on all materials', 'extreme micro-detail, every material surface rendered with tactile photographic texture — fabric weave, skin pores, metal scratches'));
    }

    if (s.mblur > 20) {
      parts.push(describeRange(s.mblur, '', 'subtle directional motion blur on moving elements', 'heavy motion blur streaking across moving subjects, 1/15s shutter speed effect'));
    }

    // ── TYPOGRAPHY ──
    if (s.textNode.trim()) {
      let typogDesc = `Explicitly render the text "${s.textNode.trim()}" ${s.textPlacement}, styled as ${s.textStyle}`;
      if (s.textRotoscope) typogDesc += ' (rotoscoped seamlessly into the scene geometry, interacting with the environment lighting)';
      parts.push(typogDesc);
    }

    // ── NEGATIVE PROMPT ──
    if (s.neg.trim()) {
      parts.push(`\n--no ${s.neg.trim()}`);
    }

    // Join with periods and proper spacing
    return parts.map((p, i) => {
      const trimmed = p.trim();
      if (i === parts.length - 1 && trimmed.startsWith('\n')) return trimmed;
      // Don't add period if already ends with punctuation
      if (/[.!?,;]$/.test(trimmed)) return trimmed;
      return trimmed + '.';
    }).join(' ');
  },
}));
