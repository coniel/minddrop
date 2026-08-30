import { afterEach, describe, expect, it } from 'vitest';
import { Selection } from '@minddrop/selection';
import { selectBlocks } from '../../selectBlocks';
import {
  cleanup,
  createTestEditorWithBlockIds,
  paragraphElement1,
  paragraphElement2,
} from '../../test-utils';
import { getBlockSelectionItems } from './getBlockSelectionItems';

// Blocks carry the IDs the app's selection identifies them by
const createEditor = () =>
  createTestEditorWithBlockIds([paragraphElement1, paragraphElement2]);

describe('getBlockSelectionItems', () => {
  afterEach(cleanup);

  it('returns the items of the editor’s selected blocks', () => {
    const editor = createEditor();

    selectBlocks(editor, [0], [1]);

    expect(getBlockSelectionItems(editor)).toHaveLength(2);
    expect(getBlockSelectionItems(editor)[0].data.editor).toBe(editor);
  });

  it('returns nothing when no blocks are selected', () => {
    const editor = createEditor();

    expect(getBlockSelectionItems(editor)).toEqual([]);
  });

  it('leaves out another editor’s blocks', () => {
    const editor = createEditor();
    const otherEditor = createEditor();

    selectBlocks(otherEditor, [0], [0]);

    // The other editor's block is in the app's selection, but not this one's
    expect(Selection.get()).toHaveLength(1);
    expect(getBlockSelectionItems(editor)).toEqual([]);
  });

  it('leaves out selection items which are not blocks', () => {
    const editor = createEditor();

    // A selection made elsewhere in the app
    Selection.select([{ id: 'entry-1', type: 'entry', data: {} }]);

    expect(getBlockSelectionItems(editor)).toEqual([]);
  });
});
