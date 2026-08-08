import { Editor as SlateEditor } from 'slate';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Transforms } from '../../Transforms';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  setup,
} from '../../test-utils';
import { getBlockSelectionRange } from './getBlockSelectionRange';

describe('getBlockSelectionRange', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns null when a single block is covered outside block mode', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    // Selecting all of a block's text is not a block selection
    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [0]),
    });

    expect(getBlockSelectionRange(editor)).toBeNull();
  });

  it('returns the range when a single block is covered in block mode', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    editor.blockSelectionMode = true;

    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [0]),
    });

    expect(getBlockSelectionRange(editor)).toEqual({
      firstIndex: 0,
      lastIndex: 0,
    });
  });

  it('returns the range when several blocks are covered', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [1]),
    });

    expect(getBlockSelectionRange(editor)).toEqual({
      firstIndex: 0,
      lastIndex: 1,
    });
  });
});
