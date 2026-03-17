import { useCallback, useRef, useState } from 'react';
import { useEditorStore } from '../../stores/useEditorStore';
import { analyzeImage } from '../../services/aiService';

export function UploadZone() {
  const imageDataUrl = useEditorStore((s) => s.imageDataUrl);
  const isAnalyzing = useEditorStore((s) => s.isAnalyzing);
  const setImageDataUrl = useEditorStore((s) => s.setImageDataUrl);
  const setIsAnalyzing = useEditorStore((s) => s.setIsAnalyzing);
  const set = useEditorStore((s) => s.set);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImageDataUrl(dataUrl);

      // Run AI image analysis (OCR)
      setIsAnalyzing(true);
      try {
        const analysis = await analyzeImage(dataUrl);
        if (analysis) {
          // Auto-fill fields from AI analysis
          const updates: Record<string, unknown> = {};
          if (analysis.foreground || analysis.midground) {
            const subjectParts = [analysis.midground, analysis.foreground].filter(Boolean);
            updates.subject = subjectParts.join(', ');
          }
          if (analysis.background || analysis.location) {
            const envParts = [analysis.location, analysis.background].filter(Boolean);
            updates.env = envParts.join(', ');
          }
          if (analysis.lighting) {
            // Try to infer lighting from description
            updates.lightSrc = 'natural daylight'; // default, AI description goes into prompt
          }
          if (analysis.mood) {
            const moodLower = analysis.mood.toLowerCase();
            const knownMoods = ['melancholic', 'tense', 'serene', 'dreamlike', 'unsettling', 'intimate', 'euphoric', 'ominous'];
            const matched = knownMoods.find(m => moodLower.includes(m));
            if (matched) updates.moods = [matched];
          }
          if (analysis.timeOfDay) {
            const todMap: Record<string, string> = {
              dawn: 'dawn', day: 'noon', morning: 'morning',
              dusk: 'dusk', night: 'night', evening: 'dusk',
              afternoon: 'afternoon', sunset: 'golden hour', sunrise: 'dawn',
            };
            const tod = todMap[analysis.timeOfDay.toLowerCase()];
            if (tod) updates.tod = tod;
          }
          set(updates as Partial<typeof updates>);
        }
      } catch (err) {
        console.error('Image analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  }, [set, setImageDataUrl, setIsAnalyzing]);

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="file-input-hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
      >
        {imageDataUrl ? (
          <img src={imageDataUrl} alt="Uploaded reference" />
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <p>Upload reference image</p>
            <small>click or drag & drop • AI will auto-analyze</small>
          </div>
        )}
        {isAnalyzing && (
          <div className="analyzing-overlay">
            <div className="analyzing-spinner" />
            <span>Analyzing image with AI...</span>
          </div>
        )}
      </div>
    </>
  );
}
