import { Range } from 'slate';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  setup,
} from '../test-utils';
import { getBlockAlignedRange } from '../utils';
import { selectBlocks } from './selectBlocks';

describe('selectBlocks', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('covers the blocks between the given ones whole', () => {
    const editor = createTestEditor([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
    ]);

    selectBlocks(editor, [0], [2]);

    expect(getBlockAlignedRange(editor)).toEqual({
      firstIndex: 0,
      lastIndex: 2,
    });
  });

  it('runs backwards when the focus is above the anchor', () => {
    const editor = createTestEditor([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
    ]);

    selectBlocks(editor, [2], [0]);

    expect(editor.selection && Range.isBackward(editor.selection)).toBe(true);
    expect(getBlockAlignedRange(editor)).toEqual({
      firstIndex: 0,
      lastIndex: 2,
    });
  });

  it('covers a single block', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    editor.blockSelectionMode = true;

    selectBlocks(editor, [1], [1]);

    expect(getBlockAlignedRange(editor)).toEqual({
      firstIndex: 1,
      lastIndex: 1,
    });
  });
});
