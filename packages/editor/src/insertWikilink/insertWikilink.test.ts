import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Ast, Element } from '@minddrop/ast';
import { cleanup, createTestEditorWithText, getWikilinks } from '../test-utils';
import { insertWikilink } from './insertWikilink';

describe('insertWikilink', () => {
  afterEach(cleanup);

  it('inserts a link showing its reference', () => {
    const editor = createTestEditorWithText();

    insertWikilink(editor, 'Book');

    expect(getWikilinks(editor)).toMatchObject([
      { reference: 'Book', children: [{ text: 'Book' }] },
    ]);
  });

  it('inserts a link showing the given label', () => {
    const editor = createTestEditorWithText();

    insertWikilink(editor, 'Books/Book', 'Book');

    expect(getWikilinks(editor)).toMatchObject([
      { reference: 'Books/Book', children: [{ text: 'Book' }] },
    ]);
  });

  it('keeps the text it is inserted over as the label', () => {
    const editor = createTestEditorWithText('this book');

    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [0]),
    });
    insertWikilink(editor, 'Book');

    // The linked phrase reads as itself rather than as what it points at
    expect(getWikilinks(editor)).toMatchObject([
      { reference: 'Book', children: [{ text: 'this book' }] },
    ]);
  });

  it('writes a link made from text back with that text as its label', () => {
    const editor = createTestEditorWithText('this book');

    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [0]),
    });
    insertWikilink(editor, 'Book');

    expect(Ast.toMarkdown(editor.children as Element[])).toBe(
      '[[Book|this book]]',
    );
  });

  it('omits the label when the text is the reference itself', () => {
    const editor = createTestEditorWithText('Book');

    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [0]),
    });
    insertWikilink(editor, 'Book');

    expect(Ast.toMarkdown(editor.children as Element[])).toBe('[[Book]]');
  });

  it('leaves the cursor after the link', () => {
    const editor = createTestEditorWithText();

    insertWikilink(editor, 'Book');
    editor.insertText('!');

    // Typing continues alongside the link rather than inside it
    expect(getWikilinks(editor)[0].children).toEqual([{ text: 'Book' }]);
    expect(SlateEditor.string(editor, [0])).toBe('Book!');
  });

  it('writes an unlabelled link back without a label', () => {
    const editor = createTestEditorWithText();

    insertWikilink(editor, 'Book');

    expect(Ast.toMarkdown(editor.children as Element[])).toBe('[[Book]]');
  });

  it('writes a qualified link back with its label', () => {
    const editor = createTestEditorWithText();

    insertWikilink(editor, 'Books/Book', 'Book');

    expect(Ast.toMarkdown(editor.children as Element[])).toBe(
      '[[Books/Book|Book]]',
    );
  });
});
