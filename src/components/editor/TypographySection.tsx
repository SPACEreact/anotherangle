import { useEditorStore } from '../../stores/useEditorStore';

const STYLES = [
  'neon sign',
  'carved into stone',
  'metallic embossed',
  'hand-painted sign',
  'glowing holographic',
  'typewriter ink',
  'graffiti spray',
  'elegant serif font',
  'bold sans-serif',
  'blood written',
  'made of fire',
  'made of water',
  'floating 3D letters',
];

const PLACEMENTS = [
  'centered',
  'in the foreground',
  'in the background',
  'integrated into the environment',
  'floating in mid-air',
  'written on a surface',
  'as a lower third subtitle',
  'occupying the negative space',
];

export function TypographySection() {
  const textNode = useEditorStore((s) => s.textNode);
  const textStyle = useEditorStore((s) => s.textStyle);
  const textPlacement = useEditorStore((s) => s.textPlacement);
  const textRotoscope = useEditorStore((s) => s.textRotoscope);
  const set = useEditorStore((s) => s.set);

  return (
    <div className="editor-section">
      <div className="section-title">Typography (Nano Banana 2)</div>
      <textarea
        value={textNode}
        onChange={(e) => set({ textNode: e.target.value })}
        placeholder="Exact text to render in the image..."
        rows={2}
      />
      <div className="control-row" style={{ marginTop: 8 }}>
        <label>Text style</label>
        <select value={textStyle} onChange={(e) => set({ textStyle: e.target.value })}>
          {STYLES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="control-row">
        <label>Placement</label>
        <select value={textPlacement} onChange={(e) => set({ textPlacement: e.target.value })}>
          {PLACEMENTS.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div className="control-row" style={{ marginTop: 12 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={textRotoscope}
            onChange={(e) => set({ textRotoscope: e.target.checked })}
          />
          <span style={{ fontSize: '0.85rem', color: '#a5b4fc' }}>Rotoscope seamlessly into scene geometry (Subject interaction)</span>
        </label>
      </div>
    </div>
  );
}
