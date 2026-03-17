import { useEditorStore } from '../../stores/useEditorStore';

export function NegativeSection() {
  const neg = useEditorStore((s) => s.neg);
  const set = useEditorStore((s) => s.set);

  return (
    <div className="editor-section">
      <div className="section-title">Negative prompt (exclude)</div>
      <textarea
        id="neg-input"
        value={neg}
        onChange={(e) => set({ neg: e.target.value })}
        placeholder="e.g. blur, overexposed, cartoon, watermark, distorted face"
        rows={2}
      />
    </div>
  );
}
