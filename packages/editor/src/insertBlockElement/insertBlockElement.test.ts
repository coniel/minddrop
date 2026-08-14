import { Editor as SlateEditor } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { HeadingElement } from '@minddrop/ast';
import {
  cleanup,
  createTestEditor,
  emptyParagraphElement,
  mathElement1,
  paragraphElement1,
} from '../test-utils';
import { insertBlockElement } from './insertBlockElement';

describe('insertBlockElement', () => {
  afterEach(cleanup);

  it('does nothing if the element type is not registered', () => {
    const editor = createTestEditor([paragraphElement1]);

    insertBlockElement(editor, 'unregistered-type');

    // Should have left the document unchanged
    expect(editor.children.length).toBe(1);
  });

  it('replaces the current block when it is empty', () => {
    const editor = createTestEditor([paragraphElement1, emptyParagraphElement]);

    // Place the cursor in the empty paragraph
    editor.selection = {
      anchor: { path: [1, 0], offset: 0 },
      focus: { path: [1, 0], offset: 0 },
    };

    insertBlockElement(editor, 'heading');

    // Should have replaced the empty paragraph
    expect(editor.children.length).toBe(2);
    expect((editor.children[1] as HeadingElement).type).toBe('heading');
  });

  it('inserts below the current block when it has content', () => {
    const editor = createTestEditor([paragraphElement1]);

    // Place the cursor in the paragraph
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    };

    insertBlockElement(editor, 'heading');

    // Should have inserted below the paragraph
    expect(editor.children.length).toBe(2);
    expect(editor.children[0]).toEqual(paragraphElement1);
    expect((editor.children[1] as HeadingElement).type).toBe('heading');
  });

  it('inserts below empty void blocks', () => {
    const editor = createTestEditor([mathElement1]);

    // Place the cursor in the void block
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    };

    insertBlockElement(editor, 'paragraph');

    // Should have kept the void block
    expect(editor.children.length).toBe(2);
    expect(editor.children[0]).toEqual(mathElement1);
  });

  it('applies the given data', () => {
    const editor = createTestEditor([paragraphElement1]);

    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    };

    insertBlockElement<HeadingElement>(editor, 'heading', { level: 3 });

    // Should have applied the requested heading level
    expect((editor.children[1] as HeadingElement).level).toBe(3);
  });

  it('places the cursor in the inserted element', () => {
    const editor = createTestEditor([paragraphElement1]);

    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    };

    insertBlockElement(editor, 'paragraph');

    // Should have collapsed the selection into the inserted element
    const end = SlateEditor.end(editor, [1]);

    expect(editor.selection).toEqual({ anchor: end, focus: end });
  });
});
