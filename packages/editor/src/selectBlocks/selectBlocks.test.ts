import { Range } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { ListItemFrame } from '@minddrop/ast';
import { Selection } from '@minddrop/selection';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
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

  it('draws in the blocks nested inside the selected ones', () => {
    const item1: ListItemFrame = {
      id: 'item-1',
      kind: 'list-item',
      ordered: false,
      marker: '-',
    };
    const editor = createTestEditor(
      assignBlockIds([
        { ...paragraphElement1, ancestry: [item1] },
        { ...paragraphElement2, ancestry: [item1] },
        paragraphElement3,
      ]),
    );

    // Selecting the block which opens the item selects the item whole
    selectBlocks(editor, [0], [0]);

    expect(getBlockAlignedRange(editor)).toEqual({
      firstIndex: 0,
      lastIndex: 1,
    });
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
