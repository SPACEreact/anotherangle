import { useEditorStore } from '../../stores/useEditorStore';

export function SubjectSection() {
  const subject = useEditorStore((s) => s.subject);
  const set = useEditorStore((s) => s.set);

  return (
    <div className="editor-section">
      <div className="section-title">Subject</div>
      <textarea
        id="subject-input"
        value={subject}
        onChange={(e) => set({ subject: e.target.value })}
        placeholder="Who or what is in the image? e.g. a woman in a red coat, standing at a rain-soaked window"
        rows={2}
      />
    </div>
  );
}
