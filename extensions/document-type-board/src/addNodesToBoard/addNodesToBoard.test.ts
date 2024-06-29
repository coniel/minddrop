import { describe, it, expect } from 'vitest';
import { addNodesToBoard } from './addNodesToBoard';
import { Nodes } from '@minddrop/nodes';
import { boardDocument } from '../test-utils';

const newNodes = [
  Nodes.generateGroupNode([], 'board-column'),
  Nodes.generateGroupNode([], 'board-column'),
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
