import { useEditorStore } from '../../stores/useEditorStore';

const STYLES = ['photorealistic', 'cinematic film grain', 'analog / 35mm', 'hyperreal', 'painterly', 'graphic novel', 'anime', '3D render', 'claymation', 'watercolor', 'oil painting', 'noir', 'cyberpunk'];

export function StyleSection() {
  const style = useEditorStore((s) => s.style);
  const grain = useEditorStore((s) => s.grain);
  const sat = useEditorStore((s) => s.sat);
  const cont = useEditorStore((s) => s.cont);
  const colorTemp = useEditorStore((s) => s.colorTemp);
  const set = useEditorStore((s) => s.set);

  return (
    <div className="editor-section">
      <div className="section-title">Visual Style</div>
      <div className="control-row">
        <label>Style</label>
        <select value={style} onChange={(e) => set({ style: e.target.value })}>
          {STYLES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="control-row">
        <label>Film grain</label>
        <input type="range" min={0} max={100} value={grain} onChange={(e) => set({ grain: +e.target.value })} />
        <span className="val">{grain}</span>
      </div>
      <div className="control-row">
        <label>Saturation</label>
        <input type="range" min={0} max={100} value={sat} onChange={(e) => set({ sat: +e.target.value })} />
        <span className="val">{sat}</span>
      </div>
      <div className="control-row">
        <label>Contrast</label>
        <input type="range" min={0} max={100} value={cont} onChange={(e) => set({ cont: +e.target.value })} />
        <span className="val">{cont}</span>
      </div>
      <div className="control-row">
        <label>Color temp</label>
        <input type="range" min={0} max={100} value={colorTemp} onChange={(e) => set({ colorTemp: +e.target.value })} />
        <span className="val">{colorTemp}</span>
      </div>
    </div>
  );
}
