import { MindDropExtension } from '@minddrop/extension';
import { BoardDocumentTypeConfig } from './BoardDocumentTypeConfig';

export const extension: MindDropExtension = {
  initialize: async ({ Documents }) => {
    Documents.register(BoardDocumentTypeConfig);
  },

  onDisable: async ({ Documents }) => {
    Documents.unregister(BoardDocumentTypeConfig.fileType);
  },
};
