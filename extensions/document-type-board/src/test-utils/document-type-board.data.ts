import { Nodes } from '@minddrop/nodes';
import { DefaultBoardProperties } from '../constants';
import { BoardData, BoardDocument } from '../types';

export const column1Node = Nodes.generateGroupNode([], 'board-column');
export const column2Node = Nodes.generateGroupNode([], 'board-column');
export const column3Node = Nodes.generateGroupNode([], 'board-column');
export const columnsNode = Nodes.generateGroupNode(
  [column1Node.id, column2Node.id, column3Node.id],
  'board-columns',
);

export const boardProperties = { ...DefaultBoardProperties };

export const boardContent: BoardData = {
  nodes: [columnsNode, column1Node, column2Node, column3Node],
  rootNodes: [columnsNode.id],
};

export const boardFileTextContent = JSON.stringify({
  properties: boardProperties,
  content: boardContent,
});

export const boardDocument: BoardDocument & { content: BoardData } = {
  properties: boardProperties,
  fileType: 'board',
  wrapped: false,
  title: 'My board',
  path: 'path/to/My board.board',
  fileTextContent: boardFileTextContent,
  content: boardContent,
};

export const boardDocumentContentNull: BoardDocument = {
  ...boardDocument,
  content: null,
};
