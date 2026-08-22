import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Element } from '@minddrop/ast';
import { cleanup, createTestEditor } from '../test-utils';
import { paragraphElement1 } from '../test-utils/editor.fixtures';
import { Editor } from '../types';
import { insertInlineElement } from './insertInlineElement';

// Returns the inline elements within a block
function getInlines(editor: Editor, index: number): Element[] {
  const block = editor.children[index] as Element;

  return block.children.filter((child): child is Element => 'type' in child);
}

describe('insertInlineElement', () => {
  afterEach(cleanup);

  it('inserts the element at the cursor', () => {
    const editor = createTestEditor([paragraphElement1]);

    Transforms.select(editor, SlateEditor.start(editor, [0]));
    insertInlineElement(editor, 'inline-math');

    expect(getInlines(editor, 0).map(({ type }) => type)).toEqual([
      'inline-math',
    ]);
  });

  it('takes in the text it is inserted over', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, children: [{ text: 'a = b' }] },
    ]);

    // Select the whole paragraph
    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [0]),
    });
    insertInlineElement(editor, 'inline-math');

    expect(getInlines(editor, 0)[0]).toMatchObject({
      type: 'inline-math',
      children: [{ text: 'a = b' }],
    });
  });

  it('leaves the cursor at the end of the element, ready to type into', () => {
    const editor = createTestEditor([paragraphElement1]);

    Transforms.select(editor, SlateEditor.start(editor, [0]));
    insertInlineElement(editor, 'inline-math');
    editor.insertText('x');

    expect(getInlines(editor, 0)[0]).toMatchObject({
      children: [{ text: 'x' }],
    });
  });

  it('does nothing for a block element type', () => {
    const editor = createTestEditor([paragraphElement1]);

    Transforms.select(editor, SlateEditor.start(editor, [0]));
    insertInlineElement(editor, 'heading');

    expect(getInlines(editor, 0)).toEqual([]);
  });

  it('does nothing without a cursor', () => {
    const editor = createTestEditor([paragraphElement1]);

    Transforms.deselect(editor);
    insertInlineElement(editor, 'inline-math');

    expect(getInlines(editor, 0)).toEqual([]);
  });
});
