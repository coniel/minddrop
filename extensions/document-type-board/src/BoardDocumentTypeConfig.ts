import { DocumentTypeConfig, Utils } from '@minddrop/extension';
import { DefaultBoardProperties } from './constants';
import { BoardView } from './components';
import { BoardContent } from './types';

export const BoardDocumentTypeConfig: DocumentTypeConfig<BoardContent> = {
  fileType: 'board',
  initialize: () => {
    const columns = [
      Utils.generateGroupNode([], 'board-column'),
      Utils.generateGroupNode([], 'board-column'),
      Utils.generateGroupNode([], 'board-column'),
    ];
    const container = Utils.generateGroupNode(
      columns.map((col) => col.id),
      'board-columns',
    );

    return {
      properties: DefaultBoardProperties,
      content: {
        nodes: [container, ...columns],
        rootNodes: [container.id],
      },
    };
  },
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
