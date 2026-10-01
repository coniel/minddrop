import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Ast, Element } from '@minddrop/ast';
import {
  cleanup,
  createTestEditor,
  createTestEditorWithText,
  getAncestry,
  paragraphElement1,
} from '../test-utils';
import { insertReferenceQuote } from './insertReferenceQuote';

describe('insertReferenceQuote', () => {
  afterEach(cleanup);

  it('inserts the quote below the block the cursor is in', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement1]);

    Transforms.select(editor, SlateEditor.start(editor, [0]));
    insertReferenceQuote(editor, 'Paper', 'a quote', '^abcd1234');

    expect(editor.children).toHaveLength(4);
    expect(getAncestry(editor, 1)).toMatchObject([{ kind: 'blockquote' }]);
  });

  it('appends the quote to the document without a cursor', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement1]);

    editor.selection = null;
    insertReferenceQuote(editor, 'Paper', 'a quote');

    expect(editor.children).toHaveLength(4);
    expect(getAncestry(editor, 2)).toMatchObject([{ kind: 'blockquote' }]);
  });

  it('places the cursor in the paragraph after the quote', () => {
    const editor = createTestEditorWithText('notes');

    insertReferenceQuote(editor, 'Paper', 'a quote');

    expect(editor.selection?.anchor.path[0]).toBe(2);
    expect(getAncestry(editor, 2)).toBeUndefined();
  });

  it('writes the quote as a quoted link', () => {
    const editor = createTestEditor([paragraphElement1]);

    editor.selection = null;
    insertReferenceQuote(editor, 'Paper', 'a quote', '^abcd1234');

    expect(Ast.toMarkdown(editor.children as Element[])).toContain(
      '> [[Paper#^abcd1234|a quote]]',
    );
  });
});
