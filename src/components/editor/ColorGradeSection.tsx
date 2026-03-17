import { useEditorStore } from '../../stores/useEditorStore';

const GRADES = [
  { value: 'teal and orange', label: 'teal & orange' },
  { value: 'desaturated cold', label: 'cold desat' },
  { value: 'warm amber skin tones', label: 'amber skin' },
  { value: 'bleach bypass', label: 'bleach bypass' },
  { value: 'lifted shadows', label: 'lifted shadows' },
  { value: 'crushed blacks', label: 'crushed blacks' },
  { value: 'neon palette', label: 'neon' },
  { value: 'muted earthy', label: 'muted earthy' },
];

export function ColorGradeSection() {
  const grades = useEditorStore((s) => s.grades);
  const toggleGrade = useEditorStore((s) => s.toggleGrade);

  return (
    <div className="editor-section">
      <div className="section-title">Color Grading</div>
      <div className="tag-group">
        {GRADES.map((g) => (
          <button
            key={g.value}
            className={`tag ${grades.includes(g.value) ? 'active' : ''}`}
            onClick={() => toggleGrade(g.value)}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
}
