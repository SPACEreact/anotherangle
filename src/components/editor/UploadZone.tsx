import { useCallback, useRef, useState } from 'react';
import { useEditorStore } from '../../stores/useEditorStore';
import { analyzeImage } from '../../services/aiService';

export function UploadZone() {
  const referenceImages = useEditorStore((s) => s.referenceImages);
  const isAnalyzing = useEditorStore((s) => s.isAnalyzing);
  const addReferenceImage = useEditorStore((s) => s.addReferenceImage);
  const removeReferenceImage = useEditorStore((s) => s.removeReferenceImage);
  const setIsAnalyzing = useEditorStore((s) => s.setIsAnalyzing);
  const set = useEditorStore((s) => s.set);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const currentCount = useEditorStore.getState().referenceImages.length;
    let availableSlots = 14 - currentCount;

    for (let i = 0; i < files.length; i++) {
      if (availableSlots <= 0) break;
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      availableSlots--;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        addReferenceImage(dataUrl);

        // Only analyze the first image to auto-fill prompt (so we don't spam API or overwrite)
        if (i === 0 && currentCount === 0) {
          setIsAnalyzing(true);
          try {
            const analysis = await analyzeImage(dataUrl);
            if (analysis) {
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
                updates.lightSrc = 'natural daylight';
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
        }
      };
      reader.readAsDataURL(file);
    }
  }, [set, addReferenceImage, setIsAnalyzing]);

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="file-input-hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''} ${referenceImages.length > 0 ? 'has-images' : ''}`}
        onClick={() => {
          if (referenceImages.length < 14) fileRef.current?.click();
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        {referenceImages.length > 0 ? (
          <div className="reference-grid">
            {referenceImages.map((src, index) => (
              <div key={index} className="reference-item">
                <img src={src} alt={`Reference ${index + 1}`} />
                <button 
                  className="remove-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeReferenceImage(index);
                  }}
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
            {referenceImages.length < 14 && (
              <div className="add-more-item" onClick={(e) => {
                e.stopPropagation();
                fileRef.current?.click();
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>Add ({referenceImages.length}/14)</span>
              </div>
            )}
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <p>Upload reference images</p>
            <small>NB2 supports up to 14 images for character/style consistency</small>
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
