import { describe, it, expect } from 'vitest';
import { addNodesToBoard } from './addNodesToBoard';
import { Nodes } from '@minddrop/nodes';
import { boardDocument } from '../test-utils';
import { stringifyBoard } from '../stringifyBoard';

const newNodes = [
  Nodes.generateGroupNode([], 'board-column'),
  Nodes.generateGroupNode([], 'board-column'),
];

const updatedBoardContent = {
  ...boardDocument.content,
  nodes: [...boardDocument.content.nodes, ...newNodes],
};

describe('addNodeToBoard', () => {
  it('adds the nodes to the board document', () => {
    expect(addNodesToBoard(boardDocument, newNodes).content).toEqual(
      updatedBoardContent,
    );
  });

  it('updates the file text content', () => {
    const updatedBoard = addNodesToBoard(boardDocument, newNodes);
    const fileTextContent = stringifyBoard({
      ...boardDocument,
      content: updatedBoardContent,
    });

    expect(updatedBoard.fileTextContent).toBe(fileTextContent);
  });
});
