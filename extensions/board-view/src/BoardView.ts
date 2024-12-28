import { MindDropExtension } from '@minddrop/extension';
import { BoardViewRenderer } from './components';
import enGB from './locales/en-GB.json';
import { BoardColumn, BoardColumnsSection } from './types';
import { removeBlocksFromBoard } from './utils';

export const extension: MindDropExtension = {
  id: 'board-view',
  locales: {
    'en-GB': enGB,
  },
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
        'en-GB': {
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
