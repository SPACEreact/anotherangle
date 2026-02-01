import { Header } from './components/layout/Header';
import { ViewportContainer } from './components/layout/ViewportContainer';
import { SubjectPanel } from './components/controls/SubjectPanel';
import { AdvancedLightingPanel } from './components/controls/AdvancedLightingPanel';
import { CompositionPanel } from './components/controls/CompositionPanel';
import { LocationTimePicker } from './components/controls/LocationTimePicker';
import { FilmStockPanel } from './components/controls/FilmStockPanel';
import { LensSelector } from './components/controls/LensSelector';
import { CameraControls } from './components/controls/CameraControls';
import { PromptOutput } from './components/output/PromptOutput';
import { AIAssistant } from './components/controls/AIAssistant';
import { Toast } from './components/ui/Toast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans select-none">
      <Header />

      <main className="max-w-[1920px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-80px)]">
        {/* LEFT SIDEBAR - Subject, Lighting & Composition */}
        <aside className="lg:col-span-3 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar max-h-full">
          <SubjectPanel />
          <CompositionPanel />
          <AdvancedLightingPanel />
        </aside>

        {/* CENTER - Viewport & Camera Controls */}
        <section className="lg:col-span-5 flex flex-col gap-4 h-full">
          <ViewportContainer />
          <CameraControls />
        </section>

        {/* RIGHT SIDEBAR - Location, AI, Lens, Film Stock & Output */}
        <aside className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto max-h-full">
          <LocationTimePicker />
          <AIAssistant />
          <div className="grid grid-cols-2 gap-3">
            <LensSelector />
            <FilmStockPanel />
          </div>
          <PromptOutput />
        </aside>
      </main>

      <Toast />
    </div>
  );
}

export default App;
