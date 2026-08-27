import { Editor as SlateEditor } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import {
  BlockquoteFrame,
  Element,
  HeadingElement,
  ListItemFrame,
  TableElement,
} from '@minddrop/ast';
import {
  cleanup,
  createTestEditor,
  emptyParagraphElement,
  mathElement1,
  paragraphElement1,
} from '../test-utils';
import { Editor } from '../types';
import { withTables } from '../withTables';
import { insertBlockElement } from './insertBlockElement';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

const item2: ListItemFrame = { ...item1, id: 'item-2' };
const quote1: BlockquoteFrame = { id: 'quote-1', kind: 'blockquote' };

// Returns the containers a block sits inside as they stand in the editor
function getAncestry(editor: Editor, index: number) {
  return (editor.children[index] as Element).ancestry;
}

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

  describe('containers', () => {
    it('keeps the depth of the list item it replaces', () => {
      const editor = createTestEditor([
        { ...paragraphElement1, ancestry: [item1] },
        // A child item, emptied by the menu query being deleted
        { ...emptyParagraphElement, ancestry: [item1, item2] },
      ]);

      editor.selection = {
        anchor: { path: [1, 0], offset: 0 },
        focus: { path: [1, 0], offset: 0 },
      };

      insertBlockElement(editor, 'paragraph');

      // Plain text inside the parent item, rather than dropping to the top
      // of the document
      expect(getAncestry(editor, 1)).toEqual([item1]);
    });

    it('stays inside a quote', () => {
      const editor = createTestEditor([
        { ...emptyParagraphElement, ancestry: [quote1] },
      ]);

      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      };

      insertBlockElement(editor, 'heading');

      // A quote is not the block's own container, so it is kept
      expect(getAncestry(editor, 0)).toEqual([quote1]);
    });

    it('nests a container entry inside the containers already there', () => {
      const editor = createTestEditor([
        { ...emptyParagraphElement, ancestry: [quote1] },
      ]);

      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      };

      insertBlockElement(editor, 'paragraph', undefined, () => item1);

      expect(getAncestry(editor, 0)).toEqual([quote1, item1]);
    });

    it('carries no ancestry at the top of the document', () => {
      const editor = createTestEditor([emptyParagraphElement]);

      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      };

      insertBlockElement(editor, 'heading');

      expect(getAncestry(editor, 0)).toBeUndefined();
    });
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

  it('places the cursor in an inserted table’s first cell', () => {
    // Tables need their normalization to build the inserted grid
    const editor = withTables(createTestEditor([paragraphElement1]));

    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    };

    insertBlockElement<TableElement>(editor, 'table', {
      align: [null, null, null],
    });

    // The cursor sits in the first header cell rather than the grid's end
    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([1, 0, 0]);
  });
});
