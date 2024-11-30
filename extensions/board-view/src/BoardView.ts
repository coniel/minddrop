import { MindDropExtension } from '@minddrop/extension';
import { BoardViewRenderer } from './components';
import { removeBlocksFromBoard } from './removeBlocksFromBoard';
import { BoardColumn, BoardColumnsSection } from './types';

export const extension: MindDropExtension = {
  initialize: async ({ Documents, Utils }) => {
    Documents.registerView({
      id: 'board',
      icon: 'kanban-square',
      initialize: () => {
        const columns: BoardColumn[] = Array.from({ length: 3 }, () => ({
          id: Utils.uuid(),
          blocks: [],
        }));

        const section: BoardColumnsSection = {
          id: Utils.uuid(),
          type: 'columns',
          columns,
        };

        return {
          sections: [section],
        };
      },
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
