import { DocumentTypeConfig } from '@minddrop/documents';
import { DefaultBoardProperties } from './constants';
import { BoardView } from './components';
import { BoardData } from './types';

export const BoardDocumentTypeConfig: DocumentTypeConfig<BoardData> = {
  fileType: 'board',
  initialize: () => ({
    properties: DefaultBoardProperties,
    content: { nodes: [], rootNodes: [] },
  }),
  parseProperties: (textContent) => {
    const parsed = JSON.parse(textContent).properties;

    if (parsed) {
      return { ...DefaultBoardProperties, ...parsed };
    }

    return DefaultBoardProperties;
  },
  parseContent: (textContent) =>
    JSON.parse(textContent).content || { nodes: [], rootNodes: [] },
  stringify: (properties, content) => JSON.stringify({ properties, content }),
  component: BoardView,
};
