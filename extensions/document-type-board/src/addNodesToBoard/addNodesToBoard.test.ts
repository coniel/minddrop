import { describe, it, expect } from 'vitest';
import { Utils } from '@minddrop/extension';
import { addNodesToBoard } from './addNodesToBoard';
import { boardDocument } from '../test-utils';

const newNodes = [
  Utils.generateGroupNode([], 'board-column'),
  Utils.generateGroupNode([], 'board-column'),
];

describe('addNodeToBoard', () => {
  it('adds the nodes to the board content', () => {
    const updatedContent = addNodesToBoard(boardDocument.content, newNodes);

    expect(updatedContent).toEqual({
      ...boardDocument.content,
      nodes: [...boardDocument.content.nodes, ...newNodes],
    });
  });
});
