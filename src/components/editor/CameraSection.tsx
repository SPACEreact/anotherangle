import { useEditorStore } from '../../stores/useEditorStore';

const SHOT_TYPES = [
  // Standard framing
  'extreme close-up', 'close-up', 'medium close-up', 'medium shot', 'medium wide', 'wide shot', 'extreme wide', 'full body shot',
  // Angle-based
  'low angle', 'high angle', 'dutch angle / tilted', "bird's eye / top-down", "worm's eye / ground level",
  // Perspective
  'over the shoulder', 'POV / first person', 'two shot', 'group shot',
  // Cinematic
  'establishing shot', 'insert / detail shot', 'reaction shot', 'silhouette shot', 'profile shot',
  // Specialty
  'macro / extreme detail', 'split diopter', 'through-the-window', 'mirror reflection shot', 'foreground framing',
];

const CAM_MOVES = [
  'static', 'slow push in', 'pull out / reveal',
  'pan left', 'pan right', 'tilt up', 'tilt down',
  'dolly in', 'dolly out', 'dolly alongside',
  'crane up', 'crane down',
  'orbit left', 'orbit right', 'full 360 orbit',
  'handheld drift', 'shaky handheld',
  'whip pan', 'rack focus',
  'steadicam follow', 'tracking shot',
  'zoom in', 'zoom out', 'dolly zoom / vertigo effect',
  'drone ascending', 'drone flyover',
];

const LENSES = [
  '8mm fisheye', '12mm', '14mm', '16mm', '18mm', '20mm', '24mm', '28mm',
  '35mm', '40mm', '50mm', '55mm', '65mm',
  '85mm', '100mm', '105mm', '135mm',
  '200mm', '300mm', '400mm', '600mm',
  '200mm', '300mm', '400mm', '600mm',
  '24-70mm zoom', '70-200mm zoom',
  'tilt-shift', 'anamorphic',
];

const APERTURES = ['unspecified', 'f/0.95', 'f/1.2', 'f/1.4', 'f/1.8', 'f/2.8', 'f/4', 'f/5.6', 'f/8', 'f/11', 'f/16', 'f/22'];

const FILM_STOCKS = [
  'none', 'Kodachrome 64', 'Portra 400', 'CineStill 800T', 'Ilford HP5', 'Tri-X 400', 'Fujifilm Velvia 50', 'Agfa Vista 200'
];

const OPTICS = [
  'anamorphic lens flares', 'chromatic aberration', 'halation edge glow', 'heavy vignetting', 'pincushion distortion', 'barrel distortion', 'lens internal reflections (ghosting)', 'soft focus bloom'
];

export function CameraSection() {
  const shotType = useEditorStore((s) => s.shotType);
  const camMove = useEditorStore((s) => s.camMove);
  const lens = useEditorStore((s) => s.lens);
  const dof = useEditorStore((s) => s.dof);
  
  const aperture = useEditorStore((s) => s.aperture);
  const filmStock = useEditorStore((s) => s.filmStock);
  const opticsEffects = useEditorStore((s) => s.opticsEffects);
  
  const set = useEditorStore((s) => s.set);
  const toggleOptics = useEditorStore((s) => s.toggleOptics);

  return (
    <div className="editor-section">
      <div className="section-title">Camera</div>
      <div className="control-row">
        <label>Shot type</label>
        <select value={shotType} onChange={(e) => set({ shotType: e.target.value })}>
          {SHOT_TYPES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="control-row">
        <label>Camera move</label>
        <select value={camMove} onChange={(e) => set({ camMove: e.target.value })}>
          {CAM_MOVES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="control-row">
        <label>Lens</label>
        <select value={lens} onChange={(e) => set({ lens: e.target.value })}>
          {LENSES.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div className="control-row">
        <label>Depth of field</label>
        <input type="range" min={0} max={100} value={dof} onChange={(e) => set({ dof: +e.target.value })} />
        <span className="val">{dof}</span>
      </div>
      <div className="control-row">
        <label>Aperture</label>
        <select value={aperture} onChange={(e) => set({ aperture: e.target.value })}>
          {APERTURES.map((a) => <option key={a}>{a}</option>)}
        </select>
      </div>
      <div className="control-row">
        <label>Film stock</label>
        <select value={filmStock} onChange={(e) => set({ filmStock: e.target.value })}>
          {FILM_STOCKS.map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div className="control-row" style={{ marginTop: 12 }}>
        <label>Optical characteristics</label>
      </div>
      <div className="tag-group">
        {OPTICS.map((o) => (
          <button
            key={o}
            className={`tag ${opticsEffects.includes(o) ? 'active' : ''}`}
            onClick={() => toggleOptics(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
