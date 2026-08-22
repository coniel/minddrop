import { Editor as SlateEditor, Transforms } from 'slate';
import { describe, expect, it } from 'vitest';
import { Element, ListItemFrame } from '@minddrop/ast';
import { EditorElementConfigs } from '../EditorElementConfigs';
import { createTestEditor } from '../test-utils';
import { emptyParagraphElement } from '../test-utils/editor.fixtures';
import { Editor } from '../types';
import { withBlockShortcuts } from './withBlockShortcuts';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

// Creates an editor with the plugin applied, with the cursor in its only
// block, ready for a shortcut to be typed
function createEditorWithShortcuts(content: Element[]): Editor {
  const editor = withBlockShortcuts(createTestEditor(content), [
    ...EditorElementConfigs,
  ]);

  Transforms.select(editor, SlateEditor.start(editor, [0]));

  return editor;
}

// Types a shortcut into the editor one character at a time, as a user does
function type(editor: Editor, text: string): void {
  text.split('').forEach((character) => editor.insertText(character));
}

// Returns the containers a block sits inside as they stand in the editor
function getAncestry(editor: Editor, index: number) {
  return (editor.children[index] as Element).ancestry;
}

describe('frame shortcuts', () => {
  it('turns a block into a bulleted list item', () => {
    const editor = createEditorWithShortcuts([emptyParagraphElement]);

    type(editor, '+ ');

    expect(getAncestry(editor, 0)).toMatchObject([
      { kind: 'list-item', ordered: false, marker: '+' },
    ]);
    expect(SlateEditor.string(editor, [0])).toBe('');
  });

  it('turns a block into a numbered list item', () => {
    const editor = createEditorWithShortcuts([emptyParagraphElement]);

    type(editor, '1) ');

    expect(getAncestry(editor, 0)).toMatchObject([
      { kind: 'list-item', ordered: true, marker: ')' },
    ]);
  });

  it('turns a block into a quote', () => {
    const editor = createEditorWithShortcuts([emptyParagraphElement]);

    type(editor, '> ');

    expect(getAncestry(editor, 0)).toMatchObject([
      { kind: 'blockquote', syntax: '> ' },
    ]);
  });

  it('respells a list item rather than nesting a list in it', () => {
    const editor = createEditorWithShortcuts([
      { ...emptyParagraphElement, ancestry: [item1] },
    ]);

    type(editor, '* ');

    expect(getAncestry(editor, 0)).toMatchObject([
      { id: item1.id, marker: '*' },
    ]);
  });

  it('gives a list item a checkbox', () => {
    const editor = createEditorWithShortcuts([
      { ...emptyParagraphElement, ancestry: [item1] },
    ]);

    type(editor, '[X] ');

    expect(getAncestry(editor, 0)).toMatchObject([
      { id: item1.id, checked: true, checkedSyntax: 'X' },
    ]);
  });

  it('writes an empty box back in its valid spelling', () => {
    const editor = createEditorWithShortcuts([
      { ...emptyParagraphElement, ancestry: [item1] },
    ]);

    type(editor, '[] ');

    expect(getAncestry(editor, 0)).toMatchObject([
      { id: item1.id, checked: false, checkedSyntax: ' ' },
    ]);
  });

  it('turns a block outside a list into a task item', () => {
    const editor = createEditorWithShortcuts([emptyParagraphElement]);

    type(editor, '[x] ');

    expect(getAncestry(editor, 0)).toMatchObject([
      { kind: 'list-item', ordered: false, marker: '-', checked: true },
    ]);
    expect(SlateEditor.string(editor, [0])).toBe('');
  });

  it('turns a quoted block into a task item within the quote', () => {
    const editor = createEditorWithShortcuts([
      {
        ...emptyParagraphElement,
        ancestry: [{ id: 'quote-1', kind: 'blockquote', syntax: '> ' }],
      },
    ]);

    type(editor, '[] ');

    // The checkbox nests an item inside the quote rather than replacing it
    expect(getAncestry(editor, 0)).toMatchObject([
      { kind: 'blockquote' },
      { kind: 'list-item', checked: false, checkedSyntax: ' ' },
    ]);
  });
});

describe('block type shortcuts', () => {
  it('turns a block into a code block, keeping the fence typed', () => {
    const editor = createEditorWithShortcuts([emptyParagraphElement]);

    type(editor, '~~~');

    expect(editor.children[0]).toMatchObject({
      type: 'code',
      fence: '~',
      fenceLength: 3,
    });
  });

  it('turns a block into a thematic break, keeping the characters typed', () => {
    const editor = createEditorWithShortcuts([emptyParagraphElement]);

    type(editor, '***');

    expect(editor.children[0]).toMatchObject({
      type: 'thematic-break',
      syntax: '***',
    });
  });

  it('turns a block into a heading of the level typed', () => {
    const editor = createEditorWithShortcuts([emptyParagraphElement]);

    type(editor, '#### ');

    expect(editor.children[0]).toMatchObject({ type: 'heading', level: 4 });
  });
});
