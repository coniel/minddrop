import { Editor as SlateEditor, Transforms } from 'slate';
import { describe, expect, it } from 'vitest';
import { Ast, Element, LinkElement } from '@minddrop/ast';
import { createTestEditor } from '../test-utils';
import { paragraphElement1 } from '../test-utils/editor.fixtures';
import { Editor } from '../types';
import { withLinks } from './withLinks';

// Creates an editor with the plugin applied, holding a single empty block
// with the cursor in it
function createEditorWithLinks(text = ''): Editor {
  const editor = withLinks(
    createTestEditor([{ ...paragraphElement1, children: [{ text }] }]),
  );

  Transforms.select(editor, SlateEditor.end(editor, [0]));

  return editor;
}

// Types text into the editor one character at a time, as a user does
function type(editor: Editor, text: string): void {
  text.split('').forEach((character) => editor.insertText(character));
}

// Returns the links within the first block
function getLinks(editor: Editor): LinkElement[] {
  const block = editor.children[0] as Element;

  return block.children.filter(
    (child): child is LinkElement => 'type' in child && child.type === 'link',
  );
}

// A clipboard holding the given plain text, and nothing in the formats the
// editor pastes its own content through
function clipboard(text: string): DataTransfer {
  return {
    getData: (format: string) => (format === 'text/plain' ? text : ''),
  } as unknown as DataTransfer;
}

describe('withLinks', () => {
  describe('typing markdown', () => {
    it('turns the markdown into a link', () => {
      const editor = createEditorWithLinks();

      type(editor, '[MindDrop](https://minddrop.app)');

      expect(getLinks(editor)).toMatchObject([
        { type: 'link', url: 'https://minddrop.app' },
      ]);
      expect(SlateEditor.string(editor, [0])).toBe('MindDrop');
    });

    it('leaves the cursor after the link', () => {
      const editor = createEditorWithLinks();

      type(editor, '[MindDrop](https://minddrop.app)');
      type(editor, '!');

      // Typing continues alongside the link rather than inside it
      expect(getLinks(editor)[0].children).toEqual([{ text: 'MindDrop' }]);
      expect(SlateEditor.string(editor, [0])).toBe('MindDrop!');
    });

    it('keeps the text which came before it', () => {
      const editor = createEditorWithLinks('Go to ');

      type(editor, '[MindDrop](https://minddrop.app)');

      expect(SlateEditor.string(editor, [0])).toBe('Go to MindDrop');
      expect(getLinks(editor)).toHaveLength(1);
    });

    it('leaves a bracketed aside as text', () => {
      const editor = createEditorWithLinks();

      type(editor, 'an aside (like this)');

      expect(getLinks(editor)).toEqual([]);
      expect(SlateEditor.string(editor, [0])).toBe('an aside (like this)');
    });
  });

  it('writes a typed link back as the markdown it was typed as', () => {
    const editor = createEditorWithLinks('Go to ');

    type(editor, '[MindDrop](https://minddrop.app)');

    expect(Ast.toMarkdown(editor.children as Element[])).toBe(
      'Go to [MindDrop](https://minddrop.app)',
    );
  });

  describe('pasting a destination', () => {
    it('turns the selected text into a link to it', () => {
      const editor = createEditorWithLinks('MindDrop');

      // Select the whole paragraph
      Transforms.select(editor, {
        anchor: SlateEditor.start(editor, [0]),
        focus: SlateEditor.end(editor, [0]),
      });
      editor.insertData(clipboard('https://minddrop.app'));

      expect(getLinks(editor)).toMatchObject([
        { url: 'https://minddrop.app', children: [{ text: 'MindDrop' }] },
      ]);
    });

    it('pastes a destination with nothing selected as text', () => {
      const editor = createEditorWithLinks();

      editor.insertData(clipboard('https://minddrop.app'));

      expect(getLinks(editor)).toEqual([]);
    });

    it('pastes text which is not a destination as text', () => {
      const editor = createEditorWithLinks('MindDrop');

      Transforms.select(editor, {
        anchor: SlateEditor.start(editor, [0]),
        focus: SlateEditor.end(editor, [0]),
      });
      editor.insertData(clipboard('not a url'));

      expect(getLinks(editor)).toEqual([]);
    });
  });
});
