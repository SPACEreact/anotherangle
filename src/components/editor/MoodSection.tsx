import { useEditorStore } from '../../stores/useEditorStore';

const MOODS = ['melancholic', 'tense', 'serene', 'dreamlike', 'unsettling', 'intimate', 'euphoric', 'cold and clinical', 'warm and nostalgic', 'ominous'];

export function MoodSection() {
  const moods = useEditorStore((s) => s.moods);
  const toggleMood = useEditorStore((s) => s.toggleMood);

  return (
    <div className="editor-section">
      <div className="section-title">Mood / Atmosphere</div>
      <div className="tag-group">
        {MOODS.map((m) => (
          <button
            key={m}
            className={`tag ${moods.includes(m) ? 'active' : ''}`}
            onClick={() => toggleMood(m)}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
