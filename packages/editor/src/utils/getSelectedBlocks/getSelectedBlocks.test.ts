import { Editor as SlateEditor } from 'slate';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Transforms } from '../../Transforms';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  setup,
} from '../../test-utils';
import { getSelectedBlocks } from './getSelectedBlocks';

describe('getSelectedBlocks', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the selected blocks', () => {
    const editor = createTestEditor([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
    ]);

    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [1]),
    });

    expect(getSelectedBlocks(editor)).toEqual([
      [editor.children[0], [0]],
      [editor.children[1], [1]],
    ]);
  });

  it('returns an empty array without a block selection', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    Transforms.select(editor, SlateEditor.start(editor, [0]));

    expect(getSelectedBlocks(editor)).toEqual([]);
  });
});
