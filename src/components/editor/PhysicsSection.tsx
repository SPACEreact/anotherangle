import { useEditorStore } from '../../stores/useEditorStore';

const VOLUMETRICS = [
  'none',
  'heavy volumetric fog',
  'god rays / light shafts filtering through',
  'dust particles catching light',
  'atmospheric perspective (distant fading)',
  'dense smoke',
  'subtle mist',
];

const MATERIALS = [
  'subsurface scattering (skin/wax)',
  'accurate caustics (water/glass light refraction)',
  'anisotropic reflections (brushed metal)',
  'specular highlights',
  'iridescent thin-film interference',
  'chromatic dispersion (prism effect)',
  'wet surface reflections',
];

export function PhysicsSection() {
  const globalIllum = useEditorStore((s) => s.globalIllum);
  const volumetrics = useEditorStore((s) => s.volumetrics);
  const materialPhysics = useEditorStore((s) => s.materialPhysics);
  const set = useEditorStore((s) => s.set);
  const togglePhysics = useEditorStore((s) => s.togglePhysics);

  return (
    <div className="editor-section">
      <div className="section-title">Physics & Light Simulation</div>
      
      <div className="control-row" style={{ marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={globalIllum}
            onChange={(e) => set({ globalIllum: e.target.checked })}
          />
          <span style={{ fontSize: '0.85rem' }}>Global Illumination (bounced ambient light)</span>
        </label>
      </div>

      <div className="control-row">
        <label>Volumetrics</label>
        <select value={volumetrics} onChange={(e) => set({ volumetrics: e.target.value })}>
          {VOLUMETRICS.map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>

      <div className="control-row" style={{ marginTop: 12 }}>
        <label>Material Render Engines</label>
      </div>
      <div className="tag-group">
        {MATERIALS.map((m) => (
          <button
            key={m}
            className={`tag ${materialPhysics.includes(m) ? 'active' : ''}`}
            onClick={() => togglePhysics(m)}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
