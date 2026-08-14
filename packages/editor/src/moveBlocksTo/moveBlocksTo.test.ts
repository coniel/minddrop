import { afterEach, describe, expect, it } from 'vitest';
import { ParagraphElement } from '@minddrop/ast';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  paragraphElement4,
  titleElement1,
} from '../test-utils';
import { IdentifiedElement } from '../types';
import { getBlockAlignedRange } from '../utils';
import { moveBlocksTo } from './moveBlocksTo';

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
});
