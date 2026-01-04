
import React from 'react';

export const DEFAULT_VN: any = {
  id: 'vn-1',
  title: 'Summer of Secrets',
  author: 'Unknown Artist',
  characters: [
    { id: 'char-1', name: 'Luna', avatarUrl: 'https://picsum.photos/seed/luna/400/600', color: '#ec4899' },
    { id: 'char-2', name: 'Kai', avatarUrl: 'https://picsum.photos/seed/kai/400/600', color: '#3b82f6' }
  ],
  scenes: [
    {
      id: 'scene-1',
      title: 'The Train Station',
      backgroundUrl: 'https://picsum.photos/seed/station/1280/720',
      dialogue: [
        { id: 'd1', characterId: 'narrator', text: 'The sun beats down on the quiet platform.' },
        { id: 'd2', characterId: 'char-1', text: 'I wonder if he will actually show up today...' }
      ],
      choices: [
        { id: 'c1', text: 'Wait for him', nextSceneId: 'scene-2' },
        { id: 'c2', text: 'Go home', nextSceneId: 'scene-3' }
      ]
    },
    {
      id: 'scene-2',
      title: 'The Meeting',
      backgroundUrl: 'https://picsum.photos/seed/cafe/1280/720',
      dialogue: [
        { id: 'd3', characterId: 'char-2', text: 'Hey, sorry I am late!' }
      ],
      choices: []
    },
    {
      id: 'scene-3',
      title: 'Empty Home',
      backgroundUrl: 'https://picsum.photos/seed/room/1280/720',
      dialogue: [
        { id: 'd4', characterId: 'narrator', text: 'The house is cold and silent.' }
      ],
      choices: []
    }
  ],
  startSceneId: 'scene-1'
};

export const Icons = {
  Play: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  ),
  Back: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
  ),
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
  )
};
