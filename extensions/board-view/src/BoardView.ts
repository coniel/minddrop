import { MindDropExtension } from '@minddrop/extension';
import { BoardViewRenderer } from './components';
import { removeBlocksFromBoard } from './removeBlocksFromBoard';

export const extension: MindDropExtension = {
  initialize: async ({ Documents }) => {
    Documents.registerView({
      id: 'board',
      icon: 'kanban-square',
      initialize: () => ({ sections: [] }),
      component: BoardViewRenderer,
      description: {
        'en-US': {
          name: 'Board',
          details: 'A board view for organizing content into sections.',
        },
      },
      onRemoveBlocks: removeBlocksFromBoard,
    });
  },

  onDisable: async ({ Documents }) => {
    Documents.unregisterView('board');
  },
};
