import { Editor as SlateEditor } from 'slate';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  blockMathElement1,
  cleanup,
  createTestEditor,
  emptyParagraphElement,
  headingElement1,
  paragraphElement1,
  setup,
} from '../test-utils';
import { insertTrailingParagraph } from './insertTrailingParagraph';

describe('insertTrailingParagraph', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('appends an empty paragraph when the document does not end in an empty element', () => {
    const editor = createTestEditor([paragraphElement1, headingElement1]);

    insertTrailingParagraph(editor);

    // Should have appended a paragraph
    expect(editor.children.length).toBe(3);
    expect(editor.children[2]).toEqual({
      type: 'paragraph',
      children: [{ text: '' }],
    });
  });

  it('does not append a paragraph when the document already ends in an empty paragraph', () => {
    const editor = createTestEditor([paragraphElement1, emptyParagraphElement]);

    insertTrailingParagraph(editor);

    // Should have left the document unchanged
    expect(editor.children.length).toBe(2);
  });

  it('does not append a paragraph when the document ends in another type of empty element', () => {
    const editor = createTestEditor([
      paragraphElement1,
      { ...headingElement1, children: [{ text: '' }] },
    ]);

    insertTrailingParagraph(editor);

    // Should have left the document unchanged
    expect(editor.children.length).toBe(2);
  });

  it('appends a paragraph when the document ends in an empty void element', () => {
    const editor = createTestEditor([paragraphElement1, blockMathElement1]);

    insertTrailingParagraph(editor);

    // Should have appended a paragraph
    expect(editor.children.length).toBe(3);
  });

  it('places the cursor in the trailing paragraph', () => {
    const editor = createTestEditor([paragraphElement1]);

    insertTrailingParagraph(editor);

    // Should have collapsed the selection into the appended paragraph
    const end = SlateEditor.end(editor, [1]);

    expect(editor.selection).toEqual({ anchor: end, focus: end });
  });
});
