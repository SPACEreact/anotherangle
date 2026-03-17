import { useEditorStore } from '../../stores/useEditorStore';

export function DetailSection() {
  const sharp = useEditorStore((s) => s.sharp);
  const tex = useEditorStore((s) => s.tex);
  const mblur = useEditorStore((s) => s.mblur);
  const set = useEditorStore((s) => s.set);

  return (
    <div className="editor-section">
      <div className="section-title">Detail Level</div>
      <div className="control-row">
        <label>Sharpness</label>
        <input type="range" min={0} max={100} value={sharp} onChange={(e) => set({ sharp: +e.target.value })} />
        <span className="val">{sharp}</span>
      </div>
      <div className="control-row">
        <label>Texture detail</label>
        <input type="range" min={0} max={100} value={tex} onChange={(e) => set({ tex: +e.target.value })} />
        <span className="val">{tex}</span>
      </div>
      <div className="control-row">
        <label>Motion blur</label>
        <input type="range" min={0} max={100} value={mblur} onChange={(e) => set({ mblur: +e.target.value })} />
        <span className="val">{mblur}</span>
      </div>
    </div>
  );
}
