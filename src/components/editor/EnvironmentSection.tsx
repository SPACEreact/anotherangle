import { useEditorStore } from '../../stores/useEditorStore';

const TIMES = ['dawn', 'morning', 'noon', 'afternoon', 'golden hour', 'dusk', 'night', 'deep night'];
const WEATHERS = ['clear', 'overcast', 'fog', 'heavy fog', 'rain', 'storm', 'snow', 'heat haze', 'dust storm'];

export function EnvironmentSection() {
  const env = useEditorStore((s) => s.env);
  const tod = useEditorStore((s) => s.tod);
  const weather = useEditorStore((s) => s.weather);
  const set = useEditorStore((s) => s.set);

  return (
    <div className="editor-section">
      <div className="section-title">Environment</div>
      <textarea
        id="env-input"
        value={env}
        onChange={(e) => set({ env: e.target.value })}
        placeholder="Where is this? e.g. abandoned train station, fog rolling in, broken glass on platform"
        rows={2}
      />
      <div className="control-row" style={{ marginTop: 8 }}>
        <label>Time of day</label>
        <select value={tod} onChange={(e) => set({ tod: e.target.value })}>
          {TIMES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="control-row">
        <label>Weather</label>
        <select value={weather} onChange={(e) => set({ weather: e.target.value })}>
          {WEATHERS.map((w) => <option key={w}>{w}</option>)}
        </select>
      </div>
    </div>
  );
}
