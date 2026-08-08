import { Editor as SlateEditor } from 'slate';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Transforms } from '../../Transforms';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  setup,
  titleElement1,
} from '../../test-utils';
import { getBlockAlignedRange } from './getBlockAlignedRange';

describe('getBlockAlignedRange', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns null when the selection is a cursor', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    Transforms.select(editor, SlateEditor.start(editor, [0]));

    expect(getBlockAlignedRange(editor)).toBeNull();
  });

  it('returns null when a block is covered in part', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    // Ends part way into the second block
    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: { path: [1, 0], offset: 4 },
    });

    expect(getBlockAlignedRange(editor)).toBeNull();
  });

  it('returns the range of the covered blocks', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [1]),
    });

    expect(getBlockAlignedRange(editor)).toEqual({
      firstIndex: 0,
      lastIndex: 1,
    });
  });

  it('returns the range when the selection runs backwards', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    Transforms.select(editor, {
      anchor: SlateEditor.end(editor, [1]),
      focus: SlateEditor.start(editor, [0]),
    });

    expect(getBlockAlignedRange(editor)).toEqual({
      firstIndex: 0,
      lastIndex: 1,
    });
  });

  it('returns null when the selection reaches into the title', () => {
    const editor = createTestEditor([
      titleElement1,
      paragraphElement1,
      paragraphElement2,
    ]);

    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [1]),
    });

    expect(getBlockAlignedRange(editor)).toBeNull();
  });
});
