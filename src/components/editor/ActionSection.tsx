import { useEditorStore } from '../../stores/useEditorStore';

const DIRECTIONS = ['none', 'left to right', 'right to left', 'inward', 'outward', 'upward', 'downward', 'circular'];

export function ActionSection() {
  const action = useEditorStore((s) => s.action);
  const motionSpeed = useEditorStore((s) => s.motionSpeed);
  const motionDir = useEditorStore((s) => s.motionDir);
  const set = useEditorStore((s) => s.set);

  return (
    <div className="editor-section">
      <div className="section-title">Action / Motion</div>
      <textarea
        id="action-input"
        value={action}
        onChange={(e) => set({ action: e.target.value })}
        placeholder="What should happen? e.g. slowly turns her head, hair drifting in wind"
        rows={2}
      />
      <div className="control-row" style={{ marginTop: 10 }}>
        <label>Motion speed</label>
        <input type="range" min={0} max={100} value={motionSpeed} onChange={(e) => set({ motionSpeed: +e.target.value })} />
        <span className="val">{motionSpeed}</span>
      </div>
      <div className="control-row">
        <label>Motion direction</label>
        <select value={motionDir} onChange={(e) => set({ motionDir: e.target.value })}>
          {DIRECTIONS.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>
    </div>
  );
}
