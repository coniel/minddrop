import { afterEach, describe, expect, it } from 'vitest';
import { Transforms } from '../../Transforms';
import { selectBlocks } from '../../selectBlocks';
import {
  cleanup,
  createTestEditorWithBlockIds,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
} from '../../test-utils';
import { getIndentTargetPaths } from './getIndentTargetPaths';

// Blocks carry the IDs the app's selection identifies them by
const createEditor = () =>
  createTestEditorWithBlockIds([
    paragraphElement1,
    paragraphElement2,
    paragraphElement3,
  ]);

describe('getIndentTargetPaths', () => {
  afterEach(cleanup);

  it('returns the selected blocks', () => {
    const editor = createEditor();

    selectBlocks(editor, [0], [1]);

    expect(getIndentTargetPaths(editor)).toEqual([[0], [1]]);
  });

  it('returns the block the cursor is in when none are selected', () => {
    const editor = createEditor();

    Transforms.select(editor, { path: [1, 0], offset: 0 });

    expect(getIndentTargetPaths(editor)).toEqual([[1]]);
  });

  it('returns nothing without a selection', () => {
    const editor = createEditor();

    // The editor holds no cursor and no selected blocks
    Transforms.deselect(editor);

    expect(getIndentTargetPaths(editor)).toEqual([]);
  });
});
