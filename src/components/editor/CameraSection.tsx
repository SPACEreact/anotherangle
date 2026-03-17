import { useEditorStore } from '../../stores/useEditorStore';

const SHOT_TYPES = ['extreme close-up', 'close-up', 'medium close-up', 'medium shot', 'medium wide', 'wide shot', 'extreme wide', "aerial / bird's eye", 'low angle', 'high angle', 'dutch angle', 'over the shoulder', 'POV'];
const CAM_MOVES = ['static', 'slow push in', 'pull out', 'pan left', 'pan right', 'tilt up', 'tilt down', 'dolly in', 'dolly out', 'crane up', 'crane down', 'orbit left', 'orbit right', 'handheld drift', 'whip pan'];
const LENSES = ['14mm', '24mm', '35mm', '50mm', '85mm', '105mm', '135mm', '200mm'];

export function CameraSection() {
  const shotType = useEditorStore((s) => s.shotType);
  const camMove = useEditorStore((s) => s.camMove);
  const lens = useEditorStore((s) => s.lens);
  const dof = useEditorStore((s) => s.dof);
  const set = useEditorStore((s) => s.set);

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
        <label>Lens focal mm</label>
        <select value={lens} onChange={(e) => set({ lens: e.target.value })}>
          {LENSES.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div className="control-row">
        <label>Depth of field</label>
        <input type="range" min={0} max={100} value={dof} onChange={(e) => set({ dof: +e.target.value })} />
        <span className="val">{dof}</span>
      </div>
    </div>
  );
}
