
import React, { useState, useEffect } from 'react';
import { VisualNovel, Scene } from '../types';
import { Icons } from '../constants';

interface PlayerProps {
  vn: VisualNovel;
  onExit: () => void;
}

export const Player: React.FC<PlayerProps> = ({ vn, onExit }) => {
  const [currentSceneId, setCurrentSceneId] = useState(vn.startSceneId);
  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [isChoiceMode, setIsChoiceMode] = useState(false);

  const scene = vn.scenes.find(s => s.id === currentSceneId) || vn.scenes[0];
  const dialogue = scene.dialogue[dialogueIdx];
  const character = vn.characters.find(c => c.id === dialogue?.characterId);

  const next = () => {
    if (dialogueIdx < scene.dialogue.length - 1) {
      setDialogueIdx(prev => prev + 1);
    } else if (scene.choices.length > 0) {
      setIsChoiceMode(true);
    } else {
      // Default behavior if no choices: end or loop (for demo, just go to start)
      // For real apps, we'd handle "Game Over" or "Credits"
    }
  };

  const selectChoice = (nextId: string) => {
    setCurrentSceneId(nextId);
    setDialogueIdx(0);
    setIsChoiceMode(false);
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden select-none">
      {/* Background Image */}
      <img 
        src={scene.backgroundUrl} 
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        alt="Background"
      />
      
      {/* Character Sprite (Simple representation) */}
      {character && !isChoiceMode && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center h-[70vh] items-end pointer-events-none transition-all animate-in slide-in-from-bottom-10 duration-500">
          <img 
            src={character.avatarUrl} 
            className="h-full object-contain filter drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            alt={character.name}
          />
        </div>
      )}

      {/* Exit Button */}
      <button 
        onClick={onExit}
        className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/80 p-2 rounded-full text-white backdrop-blur-sm transition-colors"
      >
        <Icons.Back />
      </button>

      {/* Choice Menu */}
      {isChoiceMode && (
        <div className="absolute inset-0 z-40 bg-black/40 flex flex-col items-center justify-center gap-4 p-6 animate-in fade-in duration-700">
          <h3 className="vn-font text-3xl italic mb-6 text-white text-shadow-lg">What will you do?</h3>
          {scene.choices.map(choice => (
            <button
              key={choice.id}
              onClick={() => selectChoice(choice.nextSceneId)}
              className="w-full max-w-md p-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/20 hover:border-white rounded-lg vn-font text-xl transition-all shadow-xl backdrop-blur-md"
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}

      {/* Dialogue Box */}
      {!isChoiceMode && (
        <div 
          onClick={next}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-30 group cursor-pointer"
        >
          <div className="relative bg-slate-900/90 border-2 border-slate-700 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md group-hover:border-blue-500/50 transition-colors">
            {/* Name Tag */}
            <div 
              className="absolute -top-6 left-8 px-6 py-1.5 rounded-lg font-bold text-lg shadow-lg"
              style={{ backgroundColor: character?.color || '#334155', color: '#fff' }}
            >
              {character?.name || 'Narrator'}
            </div>
            
            <div className="vn-font text-2xl leading-relaxed text-slate-100 min-h-[4rem]">
              {dialogue?.text || '...'}
            </div>

            <div className="absolute bottom-4 right-6 flex items-center gap-1 text-slate-500 font-bold text-xs uppercase animate-pulse">
              Click to continue <Icons.Play />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
