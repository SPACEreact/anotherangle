import { useEditorStore } from '../../stores/useEditorStore';

const RULES = [
  'unspecified',
  'rule of thirds',
  'golden ratio (Fibonacci spiral)',
  'symmetrical balance',
  'dynamic diagonals',
  'leading lines',
  'frame within a frame',
  'centered / dead center',
  'negative space heavy',
  'edge-to-edge / filled frame',
];

const FRAMING = [
  'unspecified',
  'clean foreground',
  'foreground elements creating depth',
  'obstructed view (voyeuristic)',
  'layered depth (foreground, midground, background)',
  'silhouetted foreground',
];

export function CompositionSection() {
  const compRule = useEditorStore((s) => s.compRule);
  const framing = useEditorStore((s) => s.framing);
  const set = useEditorStore((s) => s.set);

  return (
    <div className="editor-section">
      <div className="section-title">Composition</div>
      <div className="control-row">
        <label>Composition Rule</label>
        <select value={compRule} onChange={(e) => set({ compRule: e.target.value })}>
          {RULES.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div className="control-row">
        <label>Framing & Depth</label>
        <select value={framing} onChange={(e) => set({ framing: e.target.value })}>
          {FRAMING.map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>
    </div>
  );
}
