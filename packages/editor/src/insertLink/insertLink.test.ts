import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  createTestEditor,
  createTestEditorWithText,
  getLinks,
  paragraphElement1,
} from '../test-utils';
import { insertLink } from './insertLink';

describe('insertLink', () => {
  afterEach(cleanup);

  it('inserts a link showing its destination', () => {
    const editor = createTestEditorWithText();

    insertLink(editor, 'https://example.com');

    expect(getLinks(editor)).toMatchObject([
      {
        url: 'https://example.com',
        children: [{ text: 'https://example.com' }],
      },
    ]);
  });

  it('inserts a link showing the given label', () => {
    const editor = createTestEditorWithText();

    insertLink(editor, 'https://example.com', 'Example');

    expect(getLinks(editor)).toMatchObject([
      { url: 'https://example.com', children: [{ text: 'Example' }] },
    ]);
  });

  it('keeps the text it is inserted over as the label', () => {
    const editor = createTestEditorWithText('this site');

    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [0]),
    });
    insertLink(editor, 'https://example.com');

    // The linked phrase reads as itself rather than as its destination
    expect(getLinks(editor)).toMatchObject([
      { url: 'https://example.com', children: [{ text: 'this site' }] },
    ]);
    expect(SlateEditor.string(editor, [0])).toBe('this site');
  });

  it('prefers the given label over the replaced text', () => {
    const editor = createTestEditorWithText('this site');

    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [0]),
    });
    insertLink(editor, 'https://example.com', 'Example');

    expect(getLinks(editor)).toMatchObject([
      { url: 'https://example.com', children: [{ text: 'Example' }] },
    ]);
  });

  it('leaves the cursor after the link', () => {
    const editor = createTestEditorWithText();

    insertLink(editor, 'https://example.com', 'Example');
    editor.insertText('!');

    // Typing continues alongside the link rather than inside it
    expect(getLinks(editor)[0].children).toEqual([{ text: 'Example' }]);
    expect(SlateEditor.string(editor, [0])).toBe('Example!');
  });

  it('does nothing without a selection', () => {
    const editor = createTestEditor([paragraphElement1]);

    // The editor holds no cursor to insert at
    Transforms.deselect(editor);

    insertLink(editor, 'https://example.com');

    expect(getLinks(editor)).toEqual([]);
  });
});
