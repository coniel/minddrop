import { DocumentTypeConfig } from '@minddrop/documents';
import { DefaultBoardProperties } from './constants';
import { BoardView } from './components';
import { BoardContent } from './types';
import { Nodes } from '@minddrop/nodes';

export const BoardDocumentTypeConfig: DocumentTypeConfig<BoardContent> = {
  fileType: 'board',
  initialize: () => {
    const columns = [
      Nodes.generateGroupNode([], 'board-column'),
      Nodes.generateGroupNode([], 'board-column'),
      Nodes.generateGroupNode([], 'board-column'),
    ];
    const container = Nodes.generateGroupNode(
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
