import { useEditorStore } from '../../stores/useEditorStore';

const LIGHT_SOURCES = ['natural daylight', 'golden hour', 'magic hour', 'overcast', 'moonlight', 'neon signs', 'practical lamps', 'studio softbox', 'hard single source', 'rim / backlight', 'candle / fire', 'screen glow', 'flash / strobe'];
const LIGHT_DIRS = ['front lit', 'side lit', 'backlit / silhouette', 'top lit', 'under lit', 'diffused all-round'];

export function LightingSection() {
  const lightSrc = useEditorStore((s) => s.lightSrc);
  const lightDir = useEditorStore((s) => s.lightDir);
  const lightInt = useEditorStore((s) => s.lightInt);
  const shadowH = useEditorStore((s) => s.shadowH);
  const lightColor = useEditorStore((s) => s.lightColor);
  const set = useEditorStore((s) => s.set);

  return (
    <div className="editor-section">
      <div className="section-title">Lighting</div>
      <div className="control-row">
        <label>Light source</label>
        <select value={lightSrc} onChange={(e) => set({ lightSrc: e.target.value })}>
          {LIGHT_SOURCES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="control-row">
        <label>Light direction</label>
        <select value={lightDir} onChange={(e) => set({ lightDir: e.target.value })}>
          {LIGHT_DIRS.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div className="control-row">
        <label>Intensity</label>
        <input type="range" min={0} max={100} value={lightInt} onChange={(e) => set({ lightInt: +e.target.value })} />
        <span className="val">{lightInt}</span>
      </div>
      <div className="control-row">
        <label>Shadow hardness</label>
        <input type="range" min={0} max={100} value={shadowH} onChange={(e) => set({ shadowH: +e.target.value })} />
        <span className="val">{shadowH}</span>
      </div>
      <div className="color-row">
        <label>Light color</label>
        <input type="color" value={lightColor} onChange={(e) => set({ lightColor: e.target.value })} />
        <input
          type="text"
          value={lightColor}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) set({ lightColor: v });
          }}
          maxLength={7}
          placeholder="#ffffff"
        />
      </div>
    </div>
  );
}
