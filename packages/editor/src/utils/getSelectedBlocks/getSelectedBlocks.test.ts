import { afterEach, describe, expect, it } from 'vitest';
import { selectBlocks } from '../../selectBlocks';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
} from '../../test-utils';
import { Editor } from '../../types';
import { assignBlockIds } from '../../withBlockIds';
import { getSelectedBlocks } from './getSelectedBlocks';

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

describe('getSelectedBlocks', () => {
  afterEach(cleanup);

  it('returns the selected blocks', () => {
    const editor = createEditor();

    selectBlocks(editor, [0], [1]);

    expect(getSelectedBlocks(editor)).toEqual([
      [editor.children[0], [0]],
      [editor.children[1], [1]],
    ]);
  });

  it('returns the blocks in document order', () => {
    const editor = createEditor();

    // Selected from the bottom up
    selectBlocks(editor, [2], [1]);

    expect(getSelectedBlocks(editor).map(([, path]) => path)).toEqual([
      [1],
      [2],
    ]);
  });

  it('returns an empty array when no blocks are selected', () => {
    const editor = createEditor();

    expect(getSelectedBlocks(editor)).toEqual([]);
  });
});
