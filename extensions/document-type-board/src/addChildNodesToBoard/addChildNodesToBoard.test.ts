import { describe, it, expect } from 'vitest';
import { GroupNode } from '@minddrop/extension';
import {
  boardDocument,
  column1Node,
  textNode1,
  textNode2,
} from '../test-utils';
import { addChildNodesToBoard } from './addChildNodesToBoard';

const childNodes = [textNode1, textNode2];
const parentNode = column1Node;

describe('addNodeToBoard', () => {
  it('adds the nodes to the board document', () => {
    const updatedContent = addChildNodesToBoard(
      boardDocument.content,
      parentNode,
      childNodes,
    );

    expect(
      updatedContent.nodes.find((node) => node.id === childNodes[0].id),
    ).toEqual(childNodes[0]);
    expect(
      updatedContent.nodes.find((node) => node.id === childNodes[1].id),
    ).toEqual(childNodes[1]);
  });

  it('adds the child node IDs to the parent node children', () => {
    const updatedContent = addChildNodesToBoard(
      boardDocument.content,
      parentNode,
      childNodes,
    );

    const updatedParentNode = updatedContent.nodes.find(
      (node) => node.id === parentNode.id,
    ) as GroupNode;

    expect(updatedParentNode.children).toEqual([
      ...parentNode.children,
      childNodes[0].id,
      childNodes[1].id,
    ]);
  });

  it('adds the child node IDs at the specified index', () => {
    const updatedContent = addChildNodesToBoard(
      boardDocument.content,
      parentNode,
      childNodes,
      1,
    );

    const updatedParentNode = updatedContent.nodes.find(
      (node) => node.id === parentNode.id,
    ) as GroupNode;

    expect(updatedParentNode.children).toEqual([
      parentNode.children[0],
      childNodes[0].id,
      childNodes[1].id,
      ...parentNode.children.slice(1),
    ]);
  });
});
