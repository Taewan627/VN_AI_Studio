
export type Character = {
  id: string;
  name: string;
  avatarUrl: string;
  color: string;
};

export type DialogueLine = {
  id: string;
  characterId: string | 'narrator';
  text: string;
};

export type Choice = {
  id: string;
  text: string;
  nextSceneId: string;
};

export type Scene = {
  id: string;
  title: string;
  backgroundUrl: string;
  dialogue: DialogueLine[];
  choices: Choice[];
};

export type VisualNovel = {
  id: string;
  title: string;
  author: string;
  characters: Character[];
  scenes: Scene[];
  startSceneId: string;
};

export type AppState = 'EDITOR' | 'PLAYER' | 'DASHBOARD';
