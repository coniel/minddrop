import { Utils } from '@minddrop/extension';
import { DefaultBoardProperties } from '../constants';
import { BoardContent, BoardDocument } from '../types';

export const PARENT_DIR_PATH = 'path/to';

export const textNode1 = Utils.generateTextNode('Text 1');
export const textNode2 = Utils.generateTextNode('Text 2');
export const textNode3 = Utils.generateTextNode('Text 3');

export const column1Node = Utils.generateGroupNode(
  [textNode1.id, textNode2.id],
  'board-column',
);
export const column2Node = Utils.generateGroupNode(
  [textNode3.id],
  'board-column',
);
export const column3Node = Utils.generateGroupNode([], 'board-column');
export const columnsNode = Utils.generateGroupNode(
  [column1Node.id, column2Node.id, column3Node.id],
  'board-columns',
);

export const boardProperties = { ...DefaultBoardProperties };

export const boardContent: BoardContent = {
  nodes: [
    columnsNode,
    column1Node,
    column2Node,
    column3Node,
    textNode1,
    textNode2,
    textNode3,
  ],
  rootNodes: [columnsNode.id],
};

export const boardFileTextContent = JSON.stringify({
  properties: boardProperties,
  content: boardContent,
});

export const boardDocument: BoardDocument & { content: BoardContent } = {
  properties: boardProperties,
  fileType: 'board',
  wrapped: false,
  title: 'My board',
  path: `${PARENT_DIR_PATH}/My Board.board`,
  fileTextContent: boardFileTextContent,
  content: boardContent,
};

export const boardDocumentContentNull: BoardDocument = {
  ...boardDocument,
  content: null,
};
