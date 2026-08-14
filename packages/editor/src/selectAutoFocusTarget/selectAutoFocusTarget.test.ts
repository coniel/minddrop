import { Editor as SlateEditor } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  createTestEditor,
  emptyParagraphElement,
  emptyTitleElement,
  headingElement1,
  paragraphElement1,
  thematicBreakElement1,
  titleElement1,
} from '../test-utils';
import { selectAutoFocusTarget } from './selectAutoFocusTarget';

describe('selectAutoFocusTarget', () => {
  afterEach(cleanup);

  it('places the caret at the end of the last element', () => {
    const editor = createTestEditor([paragraphElement1, headingElement1]);

    selectAutoFocusTarget(editor);

    // Should have collapsed the selection to the end of the heading
    const end = SlateEditor.end(editor, [1]);

    expect(editor.selection).toEqual({ anchor: end, focus: end });

    // Should have left the document unchanged
    expect(editor.children.length).toBe(2);
  });

  it('appends a paragraph when the document ends in a void element', () => {
    const editor = createTestEditor([paragraphElement1, thematicBreakElement1]);

    selectAutoFocusTarget(editor);

    // Should have appended an empty paragraph
    expect(editor.children.length).toBe(3);
    expect(editor.children[2]).toEqual({
      type: 'paragraph',
      children: [{ text: '' }],
    });

    // Should have collapsed the selection into the appended paragraph
    const end = SlateEditor.end(editor, [2]);

    expect(editor.selection).toEqual({ anchor: end, focus: end });
  });

  it('places the caret in the title when the body is empty', () => {
    const editor = createTestEditor([emptyTitleElement, emptyParagraphElement]);

    selectAutoFocusTarget(editor);

    // Should have collapsed the selection into the title
    const end = SlateEditor.end(editor, [0]);

    expect(editor.selection).toEqual({ anchor: end, focus: end });
  });

  it('places the caret at the end of the title when the title has text', () => {
    const editor = createTestEditor([titleElement1, emptyParagraphElement]);

    selectAutoFocusTarget(editor);

    // Should have collapsed the selection to the end of the title text
    const end = SlateEditor.end(editor, [0]);

    expect(editor.selection).toEqual({ anchor: end, focus: end });
    expect(end.offset).toBeGreaterThan(0);
  });

  it('places the caret at the end of the body when the body has content', () => {
    const editor = createTestEditor([emptyTitleElement, paragraphElement1]);

    selectAutoFocusTarget(editor);

    // Should have collapsed the selection to the end of the paragraph
    const end = SlateEditor.end(editor, [1]);

    expect(editor.selection).toEqual({ anchor: end, focus: end });
  });

  it('treats a body ending in a void element as content', () => {
    const editor = createTestEditor([emptyTitleElement, thematicBreakElement1]);

    selectAutoFocusTarget(editor);

    // Should have appended an empty paragraph below the void element
    expect(editor.children.length).toBe(3);

    // Should have collapsed the selection into the appended paragraph
    const end = SlateEditor.end(editor, [2]);

    expect(editor.selection).toEqual({ anchor: end, focus: end });
  });
});
