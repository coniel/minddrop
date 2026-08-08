import { Range } from 'slate';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Selection } from '@minddrop/selection';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  setup,
} from '../test-utils';
import { BLOCK_SELECTION_ITEM_TYPE, Editor } from '../types';
import { getBlockAlignedRange, getSelectedBlocks } from '../utils';
import { assignBlockIds } from '../withBlockIds';
import { selectBlocks } from './selectBlocks';

/**
 * Creates an editor whose blocks carry block IDs, which the app's
 * selection identifies them by.
 *
 * @returns The editor.
 */
function createEditor(): Editor {
  return createTestEditor(
    assignBlockIds([paragraphElement1, paragraphElement2, paragraphElement3]),
  );
}

describe('selectBlocks', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('covers the blocks between the given ones whole', () => {
    const editor = createEditor();

    selectBlocks(editor, [0], [2]);

    expect(getBlockAlignedRange(editor)).toEqual({
      firstIndex: 0,
      lastIndex: 2,
    });
  });

  it('runs backwards when the focus is above the anchor', () => {
    const editor = createEditor();

    selectBlocks(editor, [2], [0]);

    expect(editor.selection && Range.isBackward(editor.selection)).toBe(true);
    expect(getBlockAlignedRange(editor)).toEqual({
      firstIndex: 0,
      lastIndex: 2,
    });
  });

  it('selects the blocks in the app’s selection', () => {
    const editor = createEditor();

    selectBlocks(editor, [0], [1]);

    expect(getSelectedBlocks(editor).map(([, path]) => path)).toEqual([
      [0],
      [1],
    ]);
  });

  it('clears a selection made elsewhere', () => {
    const editor = createEditor();

    Selection.select([{ id: 'entry-id', type: 'database-entry', data: {} }]);

    selectBlocks(editor, [0], [0]);

    expect(
      Selection.get().every((item) => item.type === BLOCK_SELECTION_ITEM_TYPE),
    ).toBe(true);
  });
});
