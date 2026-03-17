import { SubjectSection } from './components/editor/SubjectSection';
import { ActionSection } from './components/editor/ActionSection';
import { CameraSection } from './components/editor/CameraSection';
import { LightingSection } from './components/editor/LightingSection';
import { MoodSection } from './components/editor/MoodSection';
import { StyleSection } from './components/editor/StyleSection';
import { ColorGradeSection } from './components/editor/ColorGradeSection';
import { EnvironmentSection } from './components/editor/EnvironmentSection';
import { DetailSection } from './components/editor/DetailSection';
import { NegativeSection } from './components/editor/NegativeSection';
import { UploadZone } from './components/editor/UploadZone';
import { PromptDisplay } from './components/editor/PromptDisplay';

import { TypographySection } from './components/editor/TypographySection';
import { CompositionSection } from './components/editor/CompositionSection';
import { PhysicsSection } from './components/editor/PhysicsSection';

function App() {
  return (
    <div className="app-shell">
      <div className="app-grid">
        {/* LEFT SIDEBAR — All controls */}
        <aside className="sidebar">
          <TypographySection />
          <SubjectSection />
          <ActionSection />
          <CompositionSection />
          <CameraSection />
          <PhysicsSection />
          <LightingSection />
          <MoodSection />
          <StyleSection />
          <ColorGradeSection />
          <EnvironmentSection />
          <DetailSection />
          <NegativeSection />
        </aside>

        {/* MAIN PANEL — Upload + Prompt */}
        <main className="main-panel">
          <div className="top-bar">
            <span className="top-bar-title">AnotherAngle</span>
            <span className="badge">prompt generator</span>
          </div>
          <UploadZone />
          <PromptDisplay />
        </main>
      </div>
    </div>
  );
}

export default App;
