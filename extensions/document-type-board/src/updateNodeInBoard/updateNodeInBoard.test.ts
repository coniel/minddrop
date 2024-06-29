import { describe, it, expect } from 'vitest';
import { updateNodeInBoard } from './updateNodeInBoard';
import { boardDocument, columnsNode } from '../test-utils';
import { stringifyBoard } from '../stringifyBoard';

const updatedNode = {
  ...columnsNode,
  children: [...columnsNode.children, 'new-child'],
};
const updatedBoardContent = {
  ...boardDocument.content,
  nodes: [updatedNode, ...boardDocument.content.nodes.slice(1)],
};

describe('updateNodeInBoard', () => {
  it('updates the node in the board content', () => {
    const updatedBoard = updateNodeInBoard(boardDocument, updatedNode);

    expect(updatedBoard.content).toEqual(updatedBoardContent);
  });

  it('updates the document file text content', () => {
    const updatedBoard = updateNodeInBoard(boardDocument, updatedNode);
    const fileTextContent = stringifyBoard({
      ...boardDocument,
      content: updatedBoardContent,
    });

    expect(updatedBoard.fileTextContent).toBe(fileTextContent);
  });

  it('returns the board document unchanged if the node is not found', () => {
    const updatedBoard = updateNodeInBoard(boardDocument, {
      ...updatedNode,
      id: 'unknown-id',
    });

    expect(updatedBoard).toEqual(boardDocument);
  });
});
