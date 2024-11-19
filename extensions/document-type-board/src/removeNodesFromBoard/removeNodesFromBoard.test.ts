import { describe, it, expect } from 'vitest';
import { GroupNode } from '@minddrop/nodes';
import { boardContent, column1Node, textNode1, textNode3 } from '../test-utils';
import { removeNodesFromBoard } from './removeNodesFromBoard';

describe('removeNodesFromBoard', () => {
  it('removes the nodes from the board content', () => {
    const result = removeNodesFromBoard(boardContent, [textNode1, textNode3]);

    // Should remove the nodes from the board
    expect(result.nodes).not.toContain(textNode1);
    expect(result.nodes).not.toContain(textNode3);
  });

  it('updates group nodes to remove the nodes from their children', () => {
    const result = removeNodesFromBoard(boardContent, [textNode1]);

    // Get the updated group node
    const groupNode = result.nodes.find((node) => node.id === column1Node.id);
    // Should remove the node from the group node children
    expect((groupNode as GroupNode).children).not.toContain(textNode1.id);
  });

  it('does nothing if the nodes do not appear on the board', () => {
    const result = removeNodesFromBoard(boardContent, [
      { ...textNode1, id: 'unknown-id' },
    ]);

    // Should not change the board content
    expect(result).toEqual(boardContent);
  });
});
