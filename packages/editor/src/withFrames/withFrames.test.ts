import { Editor as SlateEditor, Transforms } from 'slate';
import { describe, expect, it } from 'vitest';
import { Element, ListItemFrame } from '@minddrop/ast';
import { createTestEditor } from '../test-utils';
import {
  emptyParagraphElement,
  paragraphElement1,
  paragraphElement1PlainText,
} from '../test-utils/editor.data';
import { Editor } from '../types';
import { withFrames } from './withFrames';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '*',
  checked: false,
};

const item2: ListItemFrame = { ...item1, id: 'item-2' };

// Creates an editor with the plugin applied, with the cursor at the end of
// the given block
function createEditorWithFrames(content: Element[], index = 0): Editor {
  const editor = withFrames(createTestEditor(content));

  Transforms.select(editor, SlateEditor.end(editor, [index]));

  return editor;
}

// Returns the containers a block sits inside as they stand in the editor
function getAncestry(editor: Editor, index: number) {
  return (editor.children[index] as Element).ancestry;
}

describe('withFrames', () => {
  describe('insertBreak', () => {
    it('starts a new item below a list item', () => {
      const editor = createEditorWithFrames([
        { ...paragraphElement1, ancestry: [item1] },
      ]);

      editor.insertBreak();

      const ancestry = getAncestry(editor, 1) || [];

      // The new block is a new item in the same list rather than another
      // block of the same item
      expect(ancestry).toHaveLength(1);
      expect(ancestry[0]).toMatchObject({
        kind: 'list-item',
        marker: '*',
        checked: false,
      });
      expect(ancestry[0].id).not.toBe(item1.id);
    });

    it('continues a quote as it is', () => {
      const editor = createEditorWithFrames([
        {
          ...paragraphElement1,
          ancestry: [{ id: 'quote-1', kind: 'blockquote' }],
        },
      ]);

      editor.insertBreak();

      expect(getAncestry(editor, 1)).toEqual([
        { id: 'quote-1', kind: 'blockquote' },
      ]);
    });

    it('steps an empty block out of its container', () => {
      const editor = createEditorWithFrames([
        { ...emptyParagraphElement, ancestry: [item1, item2] },
      ]);

      editor.insertBreak();

      // No block was added, the empty one stepped out a level instead
      expect(editor.children).toHaveLength(1);
      expect(getAncestry(editor, 0)).toEqual([item2]);
    });

    it('leaves a block in no container to the editor', () => {
      const editor = createEditorWithFrames([paragraphElement1]);

      editor.insertBreak();

      expect(editor.children).toHaveLength(2);
    });
  });

  describe('deleteBackward', () => {
    it('steps a block out of its container', () => {
      const editor = createEditorWithFrames([
        { ...paragraphElement1, ancestry: [item1, item2] },
      ]);

      // Backspace at the very start of the block
      Transforms.select(editor, SlateEditor.start(editor, [0]));
      editor.deleteBackward('character');

      expect(getAncestry(editor, 0)).toEqual([item2]);
    });

    it('deletes as usual from within a block', () => {
      const editor = createEditorWithFrames([
        { ...paragraphElement1, ancestry: [item1] },
      ]);

      editor.deleteBackward('character');

      expect(getAncestry(editor, 0)).toEqual([item1]);
      expect(SlateEditor.string(editor, [0])).toHaveLength(
        paragraphElement1PlainText.length - 1,
      );
    });
  });
});
