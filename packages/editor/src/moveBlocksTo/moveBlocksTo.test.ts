import { afterEach, describe, expect, it } from 'vitest';
import { Element, ListItemFrame, ParagraphElement } from '@minddrop/ast';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  paragraphElement4,
  titleElement1,
} from '../test-utils';
import { Editor, IdentifiedElement } from '../types';
import { getBlockAlignedRange } from '../utils';
import { moveBlocksTo } from './moveBlocksTo';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

const item2: ListItemFrame = { ...item1, id: 'item-2' };
const item3: ListItemFrame = { ...item1, id: 'item-3' };
const item4: ListItemFrame = { ...item1, id: 'item-4' };

// Returns the containers a block sits inside as they stand in the editor
function getAncestry(editor: Editor, index: number) {
  return (editor.children[index] as Element).ancestry;
}

describe('moveBlocksTo', () => {
  afterEach(cleanup);

  it('moves a block down to the insertion point', () => {
    const editor = createTestEditor([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
    ]);

    // Dropped below the last block
    moveBlocksTo(editor, [[0]], 3);

    expect(editor.children).toEqual([
      paragraphElement2,
      paragraphElement3,
      paragraphElement1,
    ]);
  });

  it('moves a block up to the insertion point', () => {
    const editor = createTestEditor([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
    ]);

    // Dropped above the first block
    moveBlocksTo(editor, [[2]], 0);

    expect(editor.children).toEqual([
      paragraphElement3,
      paragraphElement1,
      paragraphElement2,
    ]);
  });

  it('moves several blocks together', () => {
    const editor = createTestEditor([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
      paragraphElement4,
    ]);

    moveBlocksTo(editor, [[0], [1]], 4);

    expect(editor.children).toEqual([
      paragraphElement3,
      paragraphElement4,
      paragraphElement1,
      paragraphElement2,
    ]);
  });

  it('does nothing when dropped within the blocks being moved', () => {
    const editor = createTestEditor([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
    ]);

    // Between the two blocks being moved
    moveBlocksTo(editor, [[0], [1]], 1);

    expect(editor.children).toEqual([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
    ]);
  });

  it('does not move blocks above the title', () => {
    const editor = createTestEditor([
      titleElement1,
      paragraphElement1,
      paragraphElement2,
    ]);

    moveBlocksTo(editor, [[2]], 0);

    expect(editor.children).toEqual([
      titleElement1,
      paragraphElement2,
      paragraphElement1,
    ]);
  });

  it('selects the blocks where they land', () => {
    const editor = createTestEditor([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
    ]);

    moveBlocksTo(editor, [[0]], 3);

    expect(getBlockAlignedRange(editor)).toEqual({
      firstIndex: 2,
      lastIndex: 2,
    });
  });

  it('keeps the blocks’ IDs', () => {
    const identifiedParagraph: IdentifiedElement<ParagraphElement> = {
      ...paragraphElement1,
      id: 'block-id',
    };
    const editor = createTestEditor([
      identifiedParagraph,
      paragraphElement2,
      paragraphElement3,
    ]);

    moveBlocksTo(editor, [[0]], 3);

    expect(editor.children[2]).toHaveProperty('id', 'block-id');
  });

  describe('containers', () => {
    it('drops an item alongside the item it lands below', () => {
      const editor = createTestEditor([
        { ...paragraphElement1, ancestry: [item1] },
        { ...paragraphElement2, ancestry: [item1, item2] },
        { ...paragraphElement3, ancestry: [item1, item2, item4] },
        { ...paragraphElement4, ancestry: [item3] },
      ]);

      // The top level item is dropped below the item nested one level in
      moveBlocksTo(editor, [[3]], 2);

      expect(getAncestry(editor, 2)).toEqual([item1, item3]);
    });

    it('drops a block into the container it lands in', () => {
      const editor = createTestEditor([
        { ...paragraphElement1, ancestry: [item1] },
        { ...paragraphElement2, ancestry: [item1, item2] },
        paragraphElement3,
      ]);

      // A block which opens no container of its own joins the item above it
      moveBlocksTo(editor, [[2]], 1);

      expect(getAncestry(editor, 1)).toEqual([item1]);
    });

    it('drops a block out of every container when it lands at the top', () => {
      const editor = createTestEditor([
        { ...paragraphElement1, ancestry: [item1] },
        { ...paragraphElement2, ancestry: [item1, item2] },
      ]);

      moveBlocksTo(editor, [[1]], 0);

      expect(getAncestry(editor, 0)).toEqual([item2]);
    });

    it('keeps every dropped item an item of its own', () => {
      const editor = createTestEditor([
        { ...paragraphElement1, ancestry: [item1] },
        { ...paragraphElement2, ancestry: [item2] },
        { ...paragraphElement3, ancestry: [item3] },
        paragraphElement4,
      ]);

      // The whole list is dropped below the plain block
      moveBlocksTo(editor, [[0], [1], [2]], 4);

      // Each item keeps its own container rather than being folded into
      // the item leading the run
      expect(getAncestry(editor, 1)).toEqual([item1]);
      expect(getAncestry(editor, 2)).toEqual([item2]);
      expect(getAncestry(editor, 3)).toEqual([item3]);
    });

    it('keeps sibling items siblings when they drop into a list', () => {
      const editor = createTestEditor([
        { ...paragraphElement3, ancestry: [item3] },
        { ...paragraphElement4, ancestry: [item4] },
        { ...paragraphElement1, ancestry: [item1] },
        { ...paragraphElement2, ancestry: [item1, item2] },
      ]);

      // The two top level items are dropped below the nested one
      moveBlocksTo(editor, [[0], [1]], 4);

      // Both land one level in, still as items of their own
      expect(getAncestry(editor, 2)).toEqual([item1, item3]);
      expect(getAncestry(editor, 3)).toEqual([item1, item4]);
    });

    it('keeps the dropped blocks nested against each other', () => {
      const editor = createTestEditor([
        { ...paragraphElement1, ancestry: [item1] },
        { ...paragraphElement2, ancestry: [item1, item2] },
        paragraphElement3,
      ]);

      // The item and its child item are dropped below the plain block
      moveBlocksTo(editor, [[0], [1]], 3);

      expect(getAncestry(editor, 1)).toEqual([item1]);
      expect(getAncestry(editor, 2)).toEqual([item1, item2]);
    });
  });
});
