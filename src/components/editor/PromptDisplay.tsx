import { useState } from 'react';
import { useEditorStore } from '../../stores/useEditorStore';
import { generateIntelligentPrompt } from '../../services/aiService';

export function PromptDisplay() {
  // Subscribe to ALL state fields that buildPrompt depends on,
  // so React re-renders whenever any control changes.
  const state = useEditorStore();
  const { 
    aiPrompt, 
    isGeneratingPrompt, 
    intelligentHierarchy, 
    coreEmotion, 
    referenceImages,
    set 
  } = state;

  const [copied, setCopied] = useState(false);

  const basePrompt = state.buildPrompt();
  
  // Choose which prompt text to display and copy
  const displayPrompt = intelligentHierarchy ? (aiPrompt || '') : basePrompt;

  const handleCopy = async () => {
    if (!displayPrompt) return;
    try {
      await navigator.clipboard.writeText(displayPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = displayPrompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSynthesize = async () => {
    set({ isGeneratingPrompt: true });
    try {
      const synthesized = await generateIntelligentPrompt(basePrompt, coreEmotion, referenceImages);
      if (synthesized) {
        set({ aiPrompt: synthesized });
      } else {
        set({ aiPrompt: 'Error: Failed to synthesize. Check API key and network.' });
      }
    } catch (e) {
      console.error(e);
      set({ aiPrompt: 'Error: Failed to synthesize.' });
    } finally {
      set({ isGeneratingPrompt: false });
    }
  };

  return (
    <div className="prompt-area">
      {intelligentHierarchy && coreEmotion !== 'None' && (
         <div style={{ marginBottom: 12 }}>
            <button 
              onClick={handleSynthesize} 
              disabled={isGeneratingPrompt}
              style={{
                 width: '100%',
                 padding: '12px',
                 backgroundColor: 'var(--color-accent)',
                 color: '#000',
                 border: 'none',
                 borderRadius: '8px',
                 fontWeight: 600,
                 cursor: isGeneratingPrompt ? 'wait' : 'pointer',
                 opacity: isGeneratingPrompt ? 0.7 : 1,
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '8px'
              }}
            >
              ✨ {isGeneratingPrompt ? 'Synthesizing...' : 'Synthesize Intelligent Prompt'}
            </button>
         </div>
      )}

      <div className="prompt-out" id="prompt-output" style={{ minHeight: '150px' }}>
        {isGeneratingPrompt ? (
           <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "300ms" }} />
           </div>
        ) : (
           displayPrompt || 'Set parameters on the left (or click Synthesize) → your prompt appears here.'
        )}
      </div>
      <div className="prompt-hint">
        Copy this into Midjourney, DALL·E, Stable Diffusion, Runway, Kling, or any image/video generation tool.
      </div>
      <button className="copy-btn" onClick={handleCopy} disabled={!displayPrompt || isGeneratingPrompt}>
        {copied ? '✓ Copied!' : 'Copy prompt'}
      </button>
    </div>
  );
}
