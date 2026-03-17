import { useEditorStore } from '../../stores/useEditorStore';

const TIMES = [
  'dawn', 'sunrise', 'early morning', 'morning', 'noon',
  'afternoon', 'golden hour', 'sunset', 'blue hour',
  'dusk', 'twilight', 'night', 'midnight', 'moonlit night',
];
const WEATHERS = [
  'clear', 'partly cloudy', 'overcast', 'misty', 'fog', 'heavy fog',
  'light rain', 'rain', 'heavy rain', 'storm',
  'snow', 'blizzard', 'windy', 'heat haze', 'dust storm', 'aurora',
];

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
