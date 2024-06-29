import { describe, it, expect } from 'vitest';
import { updateNodeInBoard } from './updateNodeInBoard';
import { boardDocument, columnsNode } from '../test-utils';

const updatedNode = {
  ...columnsNode,
  children: [...columnsNode.children, 'new-child'],
};

describe('updateNodeInBoard', () => {
  it('updates the node in the content', () => {
    const updatedContent = updateNodeInBoard(
      boardDocument.content,
      updatedNode,
    );

    expect(updatedContent).toEqual({
      ...boardDocument.content,
      nodes: [updatedNode, ...boardDocument.content.nodes.slice(1)],
    });
  });

  it('returns the content unchanged if the node is not found', () => {
    const updatedContent = updateNodeInBoard(boardDocument.content, {
      ...updatedNode,
      id: 'unknown-id',
    });

    expect(updatedContent).toEqual(boardDocument.content);
  });
});
