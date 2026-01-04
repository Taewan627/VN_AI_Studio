
import React, { useState } from 'react';
import { VisualNovel, Scene, Character, DialogueLine, Choice } from '../types';
import { Icons } from '../constants';
import { generateDialogue, generateImage } from '../services/geminiService';

interface EditorProps {
  vn: VisualNovel;
  onUpdate: (vn: VisualNovel) => void;
  onPlay: () => void;
  onBack: () => void;
}

export const Editor: React.FC<EditorProps> = ({ vn, onUpdate, onPlay, onBack }) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(vn.startSceneId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState<string | null>(null);

  const currentScene = vn.scenes.find(s => s.id === selectedSceneId) || vn.scenes[0];

  const updateScene = (sceneId: string, updates: Partial<Scene>) => {
    const newScenes = vn.scenes.map(s => s.id === sceneId ? { ...s, ...updates } : s);
    onUpdate({ ...vn, scenes: newScenes });
  };

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    const newChars = vn.characters.map(c => c.id === id ? { ...c, ...updates } : c);
    onUpdate({ ...vn, characters: newChars });
  };

  const handleAiBackground = async () => {
    const prompt = window.prompt("배경 설명을 입력하세요 (예: '비 내리는 도쿄의 밤거리'):");
    if (!prompt) return;
    setIsGeneratingImg('bg');
    const url = await generateImage(prompt, "16:9");
    if (url) updateScene(selectedSceneId, { backgroundUrl: url });
    setIsGeneratingImg(null);
  };

  const handleAiCharacter = async (char: Character) => {
    const prompt = window.prompt(`${char.name}의 외양을 설명하세요 (예: '안경을 쓴 차가운 표정의 학생'):`);
    if (!prompt) return;
    setIsGeneratingImg(char.id);
    const url = await generateImage(`Anime style portrait, waist up, simple background, ${prompt}`, "3:4");
    if (url) updateCharacter(char.id, { avatarUrl: url });
    setIsGeneratingImg(null);
  };

  const handleAiDialogue = async () => {
    const context = window.prompt("이 장면에서 어떤 일이 벌어지나요?");
    if (!context) return;
    setIsGenerating(true);
    const res = await generateDialogue(context, vn.characters.map(c => c.name));
    if (res) {
      const newLines: DialogueLine[] = res.map((line: any) => ({
        id: `d-${Date.now()}-${Math.random()}`,
        characterId: vn.characters.find(c => c.name.toLowerCase() === line.characterName.toLowerCase())?.id || 'narrator',
        text: line.text
      }));
      updateScene(selectedSceneId, { dialogue: [...currentScene.dialogue, ...newLines] });
    }
    setIsGenerating(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* 1. LEFT PANE: STRUCTURE (장면 구조) */}
      <div className="w-72 border-r border-slate-800 flex flex-col bg-slate-900/30">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
            <Icons.Back />
          </button>
          <span className="font-bold text-xs uppercase tracking-widest text-slate-500">Structure</span>
          <button 
            onClick={() => {
              const newId = `scene-${Date.now()}`;
              const newScene: Scene = { id: newId, title: 'New Scene', backgroundUrl: 'https://picsum.photos/seed/s/1280/720', dialogue: [], choices: [] };
              onUpdate({ ...vn, scenes: [...vn.scenes, newScene] });
              setSelectedSceneId(newId);
            }}
            className="p-2 hover:bg-blue-600 rounded-lg text-blue-400 hover:text-white transition-all"
          >
            <Icons.Plus />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {vn.scenes.map((scene, idx) => (
            <div 
              key={scene.id}
              onClick={() => setSelectedSceneId(scene.id)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${selectedSceneId === scene.id ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-slate-800 opacity-60 hover:opacity-100'}`}
            >
              <img src={scene.backgroundUrl} className="w-full h-24 object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                <p className="text-[10px] font-bold text-blue-400 uppercase">Scene {idx + 1}</p>
                <p className="text-xs font-bold truncate">{scene.title}</p>
              </div>
              {vn.scenes.length > 1 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const filtered = vn.scenes.filter(s => s.id !== scene.id);
                    onUpdate({ ...vn, scenes: filtered, startSceneId: vn.startSceneId === scene.id ? filtered[0].id : vn.startSceneId });
                    setSelectedSceneId(filtered[0].id);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icons.Trash />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. CENTER PANE: SCRIPT EDITOR (장면 편집) */}
      <div className="flex-1 flex flex-col bg-slate-950 border-r border-slate-800">
        <header className="h-16 border-b border-slate-800 flex items-center px-8 justify-between bg-slate-900/20">
          <input 
            value={currentScene.title}
            onChange={(e) => updateScene(selectedSceneId, { title: e.target.value })}
            className="bg-transparent text-lg font-black focus:outline-none focus:text-blue-400"
          />
          <div className="flex gap-4">
            <button 
              onClick={handleAiDialogue}
              disabled={isGenerating}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              {isGenerating ? 'AI Writing...' : <><Icons.Sparkles /> AI Dialogue</>}
            </button>
            <button onClick={onPlay} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold flex items-center gap-2">
              <Icons.Play /> Preview
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
          {currentScene.dialogue.map((line, dIdx) => (
            <div key={line.id} className="flex gap-4 group animate-in slide-in-from-left-2 duration-200">
              <select 
                value={line.characterId}
                onChange={(e) => {
                  const d = [...currentScene.dialogue];
                  d[dIdx].characterId = e.target.value;
                  updateScene(selectedSceneId, { dialogue: d });
                }}
                className="w-32 flex-shrink-0 bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold focus:outline-none"
              >
                <option value="narrator">Narrator</option>
                {vn.characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <textarea 
                value={line.text}
                onChange={(e) => {
                  const d = [...currentScene.dialogue];
                  d[dIdx].text = e.target.value;
                  updateScene(selectedSceneId, { dialogue: d });
                }}
                rows={1}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none overflow-hidden"
                placeholder="대사를 입력하세요..."
                onInput={(e) => {
                  (e.target as HTMLTextAreaElement).style.height = 'auto';
                  (e.target as HTMLTextAreaElement).style.height = (e.target as HTMLTextAreaElement).scrollHeight + 'px';
                }}
              />
              <button 
                onClick={() => updateScene(selectedSceneId, { dialogue: currentScene.dialogue.filter((_, i) => i !== dIdx) })}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-400 transition-opacity"
              >
                <Icons.Trash />
              </button>
            </div>
          ))}
          <button 
            onClick={() => updateScene(selectedSceneId, { dialogue: [...currentScene.dialogue, { id: `d-${Date.now()}`, characterId: 'narrator', text: '' }] })}
            className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-slate-300 hover:border-slate-700 transition-all text-xs font-bold"
          >
            + Add New Dialogue Line
          </button>

          <div className="pt-8 border-t border-slate-800">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Branching Choices</h4>
            <div className="space-y-3">
              {currentScene.choices.map((choice, cIdx) => (
                <div key={choice.id} className="flex gap-3">
                  <input 
                    value={choice.text}
                    onChange={(e) => {
                      const cs = [...currentScene.choices];
                      cs[cIdx].text = e.target.value;
                      updateScene(selectedSceneId, { choices: cs });
                    }}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none"
                    placeholder="선택지 텍스트..."
                  />
                  <select 
                    value={choice.nextSceneId}
                    onChange={(e) => {
                      const cs = [...currentScene.choices];
                      cs[cIdx].nextSceneId = e.target.value;
                      updateScene(selectedSceneId, { choices: cs });
                    }}
                    className="w-48 bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none"
                  >
                    <option value="">End Story</option>
                    {vn.scenes.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                  <button onClick={() => updateScene(selectedSceneId, { choices: currentScene.choices.filter((_, i) => i !== cIdx) })} className="p-3 text-slate-600 hover:text-red-400">
                    <Icons.Trash />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => updateScene(selectedSceneId, { choices: [...currentScene.choices, { id: `c-${Date.now()}`, text: 'New Choice', nextSceneId: '' }] })}
                className="w-full py-3 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold transition-all"
              >
                + Add Choice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RIGHT PANE: VISUALS & CHARACTERS (캐릭터 및 에셋) */}
      <div className="w-96 flex flex-col bg-slate-900/30">
        {/* Preview Section */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Preview</h4>
            <button 
              onClick={handleAiBackground}
              disabled={isGeneratingImg === 'bg'}
              className="text-[10px] font-bold text-blue-400 hover:underline flex items-center gap-1"
            >
              {isGeneratingImg === 'bg' ? '...' : <><Icons.Sparkles /> AI BG</>}
            </button>
          </div>
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border-2 border-slate-800 shadow-2xl relative">
            <img src={currentScene.backgroundUrl} className="w-full h-full object-cover opacity-80" alt="" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">Visual Viewport</span>
            </div>
          </div>
        </div>

        {/* Characters Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Character Studio</h4>
            <button 
              onClick={() => {
                const newChar: Character = { id: `char-${Date.now()}`, name: 'New Character', avatarUrl: 'https://picsum.photos/seed/n/400/600', color: '#3b82f6' };
                onUpdate({ ...vn, characters: [...vn.characters, newChar] });
              }}
              className="p-1.5 bg-slate-800 hover:bg-blue-600 rounded-lg text-slate-400 hover:text-white transition-all"
            >
              <Icons.Plus />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {vn.characters.map(char => (
              <div key={char.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-4 group">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-800 relative group">
                    <img src={char.avatarUrl} className="w-full h-full object-cover" alt="" />
                    <button 
                      onClick={() => handleAiCharacter(char)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <Icons.Sparkles />
                    </button>
                  </div>
                  <div className="flex-1">
                    <input 
                      value={char.name}
                      onChange={(e) => updateCharacter(char.id, { name: e.target.value })}
                      className="bg-transparent text-sm font-bold w-full focus:outline-none focus:text-blue-400"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <input 
                        type="color"
                        value={char.color}
                        onChange={(e) => updateCharacter(char.id, { color: e.target.value })}
                        className="w-4 h-4 bg-transparent border-none p-0 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">{char.color}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (vn.characters.length > 1) {
                        onUpdate({ ...vn, characters: vn.characters.filter(c => c.id !== char.id) });
                      }
                    }}
                    className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <Icons.Trash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
};
