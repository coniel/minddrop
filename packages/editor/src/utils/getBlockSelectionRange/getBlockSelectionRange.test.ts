import { Editor as SlateEditor } from 'slate';
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
import { getBlockSelectionRange } from './getBlockSelectionRange';

// Blocks carry the IDs the app's selection identifies them by
const createEditor = () =>
  createTestEditorWithBlockIds([
    paragraphElement1,
    paragraphElement2,
    paragraphElement3,
  ]);

describe('getBlockSelectionRange', () => {
  afterEach(cleanup);

  it('returns the range of the selected blocks', () => {
    const editor = createEditor();

    selectBlocks(editor, [0], [1]);

    expect(getBlockSelectionRange(editor)).toEqual({
      firstIndex: 0,
      lastIndex: 1,
    });
  });

  it('returns the range of a single selected block', () => {
    const editor = createEditor();

    selectBlocks(editor, [1], [1]);

    expect(getBlockSelectionRange(editor)).toEqual({
      firstIndex: 1,
      lastIndex: 1,
    });
  });

  it('returns null when no blocks are selected', () => {
    const editor = createEditor();

    // Selecting all of a block's text is not a block selection
    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [0]),
    });

    expect(getBlockSelectionRange(editor)).toBeNull();
  });
});
