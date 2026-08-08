import { Editor as SlateEditor } from 'slate';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Transforms } from '../../Transforms';
import { selectBlocks } from '../../selectBlocks';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  setup,
} from '../../test-utils';
import { Editor } from '../../types';
import { assignBlockIds } from '../../withBlockIds';
import { getBlockSelectionRange } from './getBlockSelectionRange';

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

describe('getBlockSelectionRange', () => {
  beforeEach(setup);

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
