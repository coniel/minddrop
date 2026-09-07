import { Editor as SlateEditor, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  createTestEditor,
  headingElement1,
  paragraphElement1,
  paragraphElement2,
} from '../test-utils';
import { resetEditorContent } from './resetEditorContent';

describe('resetEditorContent', () => {
  afterEach(cleanup);

  it('replaces the content', () => {
    const editor = createTestEditor([paragraphElement1]);

    resetEditorContent(editor, [paragraphElement2, headingElement1], false);

    expect(editor.children).toEqual([paragraphElement2, headingElement1]);
  });

  it('keeps the title node', () => {
    const editor = createTestEditor([headingElement1, paragraphElement1]);

    resetEditorContent(editor, [paragraphElement2], true);

    expect(editor.children).toEqual([headingElement1, paragraphElement2]);
  });

  it('clears the selection', () => {
    const editor = createTestEditor([paragraphElement1]);

    Transforms.select(editor, SlateEditor.start(editor, []));

    resetEditorContent(editor, [paragraphElement2], false);

    expect(editor.selection).toBeNull();
  });

  it('clears the history', () => {
    const editor = createTestEditor([paragraphElement1]);

    // Make an undoable change
    Transforms.insertNodes(editor, paragraphElement2, { at: [1] });

    resetEditorContent(editor, [headingElement1], false);

    if (HistoryEditor.isHistoryEditor(editor)) {
      editor.undo();
    }

    // Nothing was undone
    expect(editor.children).toEqual([headingElement1]);
  });
});
