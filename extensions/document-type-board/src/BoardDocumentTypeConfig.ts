import { DocumentTypeConfig, Utils } from '@minddrop/extension';
import { DefaultBoardProperties } from './constants';
import { BoardView } from './components';
import { BoardContent } from './types';

export const BoardDocumentTypeConfig: DocumentTypeConfig<BoardContent> = {
  fileType: 'board',
  initialize: () => {
    const columns = [
      Utils.generateBlock('board-column'),
      Utils.generateBlock('board-column'),
      Utils.generateBlock('board-column'),
    ];
    const container = Utils.generateBlock('board-columns', {
      children: columns.map((col) => col.id),
    });

    return {
      properties: DefaultBoardProperties,
      content: {
        blocks: [container, ...columns],
        rootBlocks: [container.id],
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
    JSON.parse(textContent).content || { blocks: [], rootBlocks: [] },
  stringify: (properties, content) => JSON.stringify({ properties, content }),
  component: BoardView,
};
