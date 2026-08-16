import { describe, expect, it } from 'vitest';
import { Element, ListItemFrame } from '@minddrop/ast';
import { createTestEditor } from '../test-utils';
import {
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
} from '../test-utils/editor.data';
import { Editor } from '../types';
import { indentBlocks } from './indentBlocks';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

const item2: ListItemFrame = { ...item1, id: 'item-2' };
const item3: ListItemFrame = { ...item1, id: 'item-3' };

// Returns the containers a block sits inside as they stand in the editor
function getAncestry(editor: Editor, index: number) {
  return (editor.children[index] as Element).ancestry;
}

describe('indentBlocks', () => {
  it('nests an item inside the item above it', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item2] },
    ]);

    indentBlocks(editor, [[1]]);

    expect(getAncestry(editor, 1)).toEqual([item1, item2]);
  });

  it('carries the blocks nested inside it along', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item2] },
      // A second block of the indented item
      { ...paragraphElement3, ancestry: [item2] },
    ]);

    indentBlocks(editor, [[1]]);

    expect(getAncestry(editor, 2)).toEqual([item1, item2]);
  });

  it('leaves the first item of a list where it is', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item2] },
    ]);

    indentBlocks(editor, [[0]]);

    expect(getAncestry(editor, 0)).toEqual([item1]);
  });

  it('indents sibling items to the same depth', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item2] },
      { ...paragraphElement3, ancestry: [item3] },
    ]);

    indentBlocks(editor, [[1], [2]]);

    // Both become children of the item above them rather than the second
    // nesting inside the first
    expect(getAncestry(editor, 1)).toEqual([item1, item2]);
    expect(getAncestry(editor, 2)).toEqual([item1, item3]);
  });
});
