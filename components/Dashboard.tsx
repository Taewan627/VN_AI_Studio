
import React, { useState } from 'react';
import { VisualNovel } from '../types';
import { Icons, DEFAULT_VN } from '../constants';

interface DashboardProps {
  onSelect: (vn: VisualNovel) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelect }) => {
  const [projects, setProjects] = useState<VisualNovel[]>([DEFAULT_VN]);

  const createNewProject = () => {
    const newProject: VisualNovel = {
      id: `proj-${Date.now()}`,
      title: 'Untilted Masterpiece',
      author: 'Unknown Artist',
      characters: [
        { id: 'c1', name: 'Protagonist', avatarUrl: 'https://picsum.photos/seed/p/400/600', color: '#3b82f6' }
      ],
      scenes: [
        {
          id: 's1',
          title: 'Introduction',
          backgroundUrl: 'https://picsum.photos/seed/intro/1280/720',
          dialogue: [{ id: 'd1', characterId: 'narrator', text: 'Where does your story begin?' }],
          choices: []
        }
      ],
      startSceneId: 's1'
    };
    setProjects([newProject, ...projects]);
    onSelect(newProject);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-2">VN STUDIO</h1>
            <p className="text-slate-500 text-lg">Build the interactive worlds of your dreams—no coding required.</p>
          </div>
          <button 
            onClick={createNewProject}
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 transition-all hover:-translate-y-1"
          >
            <Icons.Plus /> New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(proj => (
            <div 
              key={proj.id}
              className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className="aspect-video w-full bg-slate-800 relative overflow-hidden">
                <img 
                  src={proj.scenes[0]?.backgroundUrl || 'https://picsum.photos/800/450'} 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  alt={proj.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-xl font-bold text-white">{proj.title}</h3>
                  <p className="text-sm text-slate-400">Created by {proj.author}</p>
                </div>
              </div>
              <div className="p-6 flex gap-3">
                <button 
                  onClick={() => onSelect(proj)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors"
                >
                  <Icons.Edit /> Edit
                </button>
                <button 
                  onClick={() => onSelect(proj)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors"
                >
                  <Icons.Play /> Play
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
