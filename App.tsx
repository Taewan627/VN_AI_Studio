
import React, { useState } from 'react';
import { AppState, VisualNovel } from './types';
import { Dashboard } from './components/Dashboard';
import { Editor } from './components/Editor';
import { Player } from './components/Player';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('DASHBOARD');
  const [activeProject, setActiveProject] = useState<VisualNovel | null>(null);

  const handleSelectProject = (project: VisualNovel) => {
    setActiveProject(project);
    setView('EDITOR');
  };

  const handleUpdateProject = (updated: VisualNovel) => {
    setActiveProject(updated);
  };

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
      {view === 'DASHBOARD' && (
        <Dashboard onSelect={handleSelectProject} />
      )}

      {view === 'EDITOR' && activeProject && (
        <Editor 
          vn={activeProject} 
          onUpdate={handleUpdateProject}
          onPlay={() => setView('PLAYER')}
          onBack={() => setView('DASHBOARD')}
        />
      )}

      {view === 'PLAYER' && activeProject && (
        <Player 
          vn={activeProject}
          onExit={() => setView('EDITOR')}
        />
      )}
    </div>
  );
};

export default App;
