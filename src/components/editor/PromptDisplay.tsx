import { useState } from 'react';
import { useEditorStore } from '../../stores/useEditorStore';

export function PromptDisplay() {
  // Subscribe to ALL state fields that buildPrompt depends on,
  // so React re-renders whenever any control changes.
  const state = useEditorStore();
  const [copied, setCopied] = useState(false);

  const prompt = state.buildPrompt();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="prompt-area">
      <div className="prompt-out" id="prompt-output">
        {prompt || 'Set parameters on the left → your prompt appears here.'}
      </div>
      <div className="prompt-hint">
        Copy this into Midjourney, DALL·E, Stable Diffusion, Runway, Kling, or any image/video generation tool.
      </div>
      <button className="copy-btn" onClick={handleCopy}>
        {copied ? '✓ Copied!' : 'Copy prompt'}
      </button>
    </div>
  );
}
