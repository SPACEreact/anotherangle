import { Header } from './components/layout/Header';
import { ViewportContainer } from './components/layout/ViewportContainer';
import { SubjectPanel } from './components/controls/SubjectPanel';
import { LocationTimePicker } from './components/controls/LocationTimePicker';
import { CameraControls } from './components/controls/CameraControls';
import { PromptOutput } from './components/output/PromptOutput';
import { Toast } from './components/ui/Toast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans select-none">
      <Header />

      <main className="max-w-[1920px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-80px)]">
        <aside className="lg:col-span-3 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar max-h-full">
          <SubjectPanel />
          <LocationTimePicker />
        </aside>

        <section className="lg:col-span-5 flex flex-col gap-4 h-full">
          <ViewportContainer />
          <CameraControls />
        </section>

        <aside className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto max-h-full">
          <PromptOutput />
        </aside>
      </main>

      <Toast />
    </div>
  );
}

export default App;
