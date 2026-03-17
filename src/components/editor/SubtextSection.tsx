import { useEditorStore } from '../../stores/useEditorStore';

const EMOTIONS = [
  'None',
  'Grief', 'Melancholy', 'Despair', 'Euphoria', 'Anticipation',
  'Dread', 'Shame', 'Pride (Earned)', 'Arrogance', 'Jealousy',
  'Nostalgia', 'Awe', 'Confusion', 'Relief', 'Betrayal',
  'Determination', 'Obsession', 'Serenity', 'Alienation',
  'Hope (Active)', 'Regret', 'Paranoia', 'Triumph', 'Emptiness'
];

const ANCHOR_PURPOSES = [
  'unspecified',
  'Character Reveal (internal state)',
  'Theme Support (scene subtext)',
  'Direct the Eye (compositional weight)'
];

export function SubtextSection() {
  const coreEmotion = useEditorStore((s) => s.coreEmotion);
  const pressureLevel = useEditorStore((s) => s.pressureLevel);
  const anchorObject = useEditorStore((s) => s.anchorObject);
  const anchorPurpose = useEditorStore((s) => s.anchorPurpose);
  const antiCliche = useEditorStore((s) => s.antiCliche);
  const set = useEditorStore((s) => s.set);

  return (
    <div className="editor-section" style={{ borderBottom: '2px solid var(--color-border-secondary)' }}>
      <div className="section-title" style={{ color: 'var(--color-accent)' }}>
        Step 1: Subtext & Psychology
      </div>
      <p style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', marginBottom: 12 }}>
        "Every Object is Evidence." Define the underlying tension before rendering the scene.
      </p>

      <div className="control-row">
        <label>Core Emotion</label>
        <select value={coreEmotion} onChange={(e) => set({ coreEmotion: e.target.value })}>
          {EMOTIONS.map((e) => <option key={e}>{e}</option>)}
        </select>
      </div>

      <div className="control-row">
        <label>Visual Pressure</label>
        <input 
          type="range" 
          min={1} 
          max={10} 
          step={1}
          value={pressureLevel} 
          onChange={(e) => set({ pressureLevel: +e.target.value })} 
        />
        <span className="val text-amber-500">{pressureLevel}/10</span>
      </div>

      <div className="control-row" style={{ marginTop: 12 }}>
        <label>Anchor Object</label>
        <input 
          type="text" 
          value={anchorObject} 
          onChange={(e) => set({ anchorObject: e.target.value })} 
          placeholder="e.g. overflowing ashtray" 
          style={{
            flex: 1, 
            fontSize: 12, 
            padding: '5px 8px', 
            background: 'var(--color-background-secondary)', 
            border: '0.5px solid var(--color-border-tertiary)', 
            borderRadius: 'var(--border-radius-sm)', 
            color: 'var(--color-text-primary)'
          }}
        />
      </div>

      {anchorObject && (
        <div className="control-row">
          <label>Purpose</label>
          <select value={anchorPurpose} onChange={(e) => set({ anchorPurpose: e.target.value })}>
            {ANCHOR_PURPOSES.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
      )}

      <div className="control-row" style={{ marginTop: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', width: '100%' }}>
          <input
            type="checkbox"
            checked={antiCliche}
            onChange={(e) => set({ antiCliche: e.target.checked })}
          />
          <span style={{ fontSize: '0.85rem', color: '#fbbf24' }}>
            Anti-Cliché (Subvert expected visual tropes)
          </span>
        </label>
      </div>
    </div>
  );
}
