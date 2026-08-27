import { Node, Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import {
  Ast,
  Element,
  TableCellElement,
  TableElement,
  TableRowElement,
} from '@minddrop/ast';
import { TableElementConfig } from '../default-element-configs';
import {
  cleanup,
  createTestEditor,
  generateTestTableRow as row,
  generateTestTable as table,
} from '../test-utils';
import { Editor } from '../types';
import { withBlockShortcuts } from '../withBlockShortcuts';
import { withTables } from './withTables';

/**
 * Creates a table enabled test editor with the given content.
 *
 * @param content - The editor's content.
 * @returns An editor instance.
 */
function createEditor(content: Element[]): Editor {
  return withTables(createTestEditor(content));
}

/**
 * Normalizes the entire editor, which is how a document is checked after
 * its content was set directly.
 *
 * @param editor - An editor instance.
 */
function normalize(editor: Editor): void {
  SlateEditor.normalize(editor, { force: true });
}

describe('withTables', () => {
  afterEach(cleanup);

  describe('normalization', () => {
    it('builds a starter grid around a table without rows', () => {
      // A block converted into a table keeps its inline content
      const editor = createEditor([
        Ast.generateElement<TableElement>('table', {
          align: [],
          children: [{ text: 'Content' }],
        }),
      ]);

      normalize(editor);

      const normalized = editor.children[0] as TableElement;

      // The starter grid is two columns wide with a header and two body rows
      expect(normalized.children).toHaveLength(3);
      expect(normalized.align).toEqual([null, null]);
      normalized.children.forEach((tableRow) => {
        expect((tableRow as TableRowElement).children).toHaveLength(2);
      });

      // The content lands in the first header cell
      const headerRow = normalized.children[0] as TableRowElement;

      expect(Node.string(headerRow.children[0])).toBe('Content');
    });

    it('sizes the starter grid to the declared alignment', () => {
      const editor = createEditor([
        Ast.generateElement<TableElement>('table', {
          align: [null, null, null],
          children: [{ text: '' }],
        }),
      ]);

      normalize(editor);

      const normalized = editor.children[0] as TableElement;

      // The grid follows the three column alignment
      expect(normalized.align).toEqual([null, null, null]);
      normalized.children.forEach((tableRow) => {
        expect((tableRow as TableRowElement).children).toHaveLength(3);
      });
    });

    it('pads ragged rows to the widest row', () => {
      const editor = createEditor([
        Ast.generateElement<TableElement>('table', {
          align: [null, null],
          children: [row(['a', 'b']), row(['c'])],
        }),
      ]);

      normalize(editor);

      const normalized = editor.children[0] as TableElement;

      // The short row gains an empty cell
      normalized.children.forEach((tableRow) => {
        expect((tableRow as TableRowElement).children).toHaveLength(2);
      });
    });

    it('sizes the alignment to the column count', () => {
      const editor = createEditor([
        table(
          [
            ['a', 'b'],
            ['c', 'd'],
          ],
          ['left'],
        ),
      ]);

      normalize(editor);

      const normalized = editor.children[0] as TableElement;

      // The alignment keeps what it declared and defaults the rest
      expect(normalized.align).toEqual(['left', null]);
    });

    it('dissolves a block pasted into a cell into its content', () => {
      const editor = createEditor([
        Ast.generateElement<TableElement>('table', {
          align: [null],
          children: [
            Ast.generateElement<TableRowElement>('table-row', {
              children: [
                Ast.generateElement<TableCellElement>('table-cell', {
                  children: [
                    Ast.generateElement('paragraph', {
                      children: [{ text: 'Block text' }],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);

      normalize(editor);

      const normalized = editor.children[0] as TableElement;
      const firstRow = normalized.children[0] as TableRowElement;
      const firstCell = firstRow.children[0] as TableCellElement;

      // The paragraph dissolves into the cell's inline content
      expect(Node.string(firstCell)).toBe('Block text');
      expect(firstCell.children.every((child) => !('type' in child))).toBe(
        true,
      );
    });

    it('turns a table whose rows have no cells into a paragraph', () => {
      const editor = createEditor([
        Ast.generateElement<TableElement>('table', {
          align: [],
          children: [
            Ast.generateElement<TableRowElement>('table-row', {
              children: [{ text: '' }],
            }),
          ],
        }),
      ]);

      normalize(editor);

      // Nothing remains to be a grid, so the block becomes a paragraph
      expect(
        editor.children.every((child) => (child as Element).type !== 'table'),
      ).toBe(true);
    });

    it('dissolves rows which sit outside a table', () => {
      // A table converted into a paragraph keeps its rows as children
      const editor = createEditor([
        Ast.generateElement('paragraph', {
          children: [row(['a', 'b'])],
        }),
      ]);

      normalize(editor);

      const normalized = editor.children[0] as Element;

      // The row and its cells dissolve into the paragraph's inline content
      expect(normalized.type).toBe('paragraph');
      expect(Node.string(normalized)).toBe('ab');
      expect(normalized.children.every((child) => !('type' in child))).toBe(
        true,
      );
    });
  });

  describe('insertBreak', () => {
    it('moves down a row rather than splitting the table', () => {
      const editor = createEditor([
        table([
          ['a', 'b'],
          ['c', 'd'],
        ]),
      ]);

      // Place the cursor in the second header cell
      Transforms.select(editor, SlateEditor.end(editor, [0, 0, 1]));

      editor.insertBreak();

      // The table is still one block, and the cursor sits in the cell below
      expect(editor.children).toHaveLength(1);
      expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 1, 1]);
    });

    it('removes an empty last row and steps out to the block below', () => {
      const editor = createEditor([
        table([
          ['a', 'b'],
          ['', ''],
        ]),
        Ast.generateElement('paragraph', { children: [{ text: 'After' }] }),
      ]);

      // Place the cursor in the empty last row
      Transforms.select(editor, SlateEditor.start(editor, [0, 1, 0]));

      editor.insertBreak();

      const tableElement = editor.children[0] as TableElement;

      // The empty row is gone, and the cursor sits in the following block
      expect(tableElement.children).toHaveLength(1);
      expect(editor.selection?.anchor.path[0]).toBe(1);
      expect(editor.selection?.anchor.offset).toBe(0);
    });

    it('adds a paragraph when exiting a table which ends the document', () => {
      const editor = createEditor([
        table([
          ['a', 'b'],
          ['', ''],
        ]),
      ]);

      // Place the cursor in the empty last row
      Transforms.select(editor, SlateEditor.start(editor, [0, 1, 0]));

      editor.insertBreak();

      // A paragraph now follows the table, holding the cursor
      expect(editor.children).toHaveLength(2);
      expect((editor.children[1] as Element).type).toBe('paragraph');
      expect(editor.selection?.anchor.path[0]).toBe(1);
    });

    it('grows a single row table rather than removing its header', () => {
      const editor = createEditor([table([['', '']])]);

      // Place the cursor in the empty header row, which is also the last
      Transforms.select(editor, SlateEditor.start(editor, [0, 0, 0]));

      editor.insertBreak();

      const tableElement = editor.children[0] as TableElement;

      // The table gains a row instead of losing its only one
      expect(tableElement.children).toHaveLength(2);
    });

    it('grows the table by a row from the last row, keeping the column', () => {
      const editor = createEditor([
        table([
          ['a', 'b', 'c'],
          ['d', 'e', 'f'],
        ]),
      ]);

      // Place the cursor in the last row's middle cell
      Transforms.select(editor, SlateEditor.end(editor, [0, 1, 1]));

      editor.insertBreak();

      const tableElement = editor.children[0] as TableElement;

      // The table gains an empty row, and the cursor stays in its column
      expect(editor.children).toHaveLength(1);
      expect(tableElement.children).toHaveLength(3);
      expect(Node.string(tableElement.children[2])).toBe('');
      expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 2, 1]);
    });

    it('starts the new row at its first cell from the last column', () => {
      const editor = createEditor([
        table([
          ['a', 'b', 'c'],
          ['d', 'e', 'f'],
        ]),
      ]);

      // Place the cursor in the last row's last cell
      Transforms.select(editor, SlateEditor.end(editor, [0, 1, 2]));

      editor.insertBreak();

      const tableElement = editor.children[0] as TableElement;

      // The table gains an empty row, and the cursor wraps to its first
      // cell
      expect(tableElement.children).toHaveLength(3);
      expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 2, 0]);
    });
  });

  describe('insertSoftBreak', () => {
    it('inserts a row below the current one from any row', () => {
      const editor = createEditor([
        table([
          ['a', 'b'],
          ['c', 'd'],
        ]),
      ]);

      // Place the cursor in the second header cell
      Transforms.select(editor, SlateEditor.end(editor, [0, 0, 1]));

      editor.insertSoftBreak();

      const tableElement = editor.children[0] as TableElement;

      // An empty row lands between the two, and the cursor stays in its
      // column
      expect(tableElement.children).toHaveLength(3);
      expect(Node.string(tableElement.children[1])).toBe('');
      expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 1, 1]);
    });
  });

  describe('deleteBackward', () => {
    it('moves to the previous cell rather than deleting at the start of a cell', () => {
      const editor = createEditor([table([['a', 'b']])]);

      // Place the cursor at the start of the second cell
      Transforms.select(editor, SlateEditor.start(editor, [0, 0, 1]));

      editor.deleteBackward('character');

      // Nothing was deleted, and the cursor sits at the end of the first cell
      expect(Node.string(editor.children[0])).toBe('ab');
      expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 0]);
    });

    it('wraps to the previous row when moving from a row start', () => {
      const editor = createEditor([
        table([
          ['a', 'b'],
          ['c', 'd'],
        ]),
      ]);

      // Place the cursor at the start of the second row's first cell
      Transforms.select(editor, SlateEditor.start(editor, [0, 1, 0]));

      editor.deleteBackward('character');

      // The cursor sits at the end of the header row's last cell
      expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 1]);
    });

    it('does nothing in the table’s first cell', () => {
      const editor = createEditor([table([['a', 'b']])]);

      // Place the cursor at the start of the first cell
      Transforms.select(editor, SlateEditor.start(editor, [0, 0, 0]));

      editor.deleteBackward('character');

      // The table is untouched
      expect(Node.string(editor.children[0])).toBe('ab');
      expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 0]);
    });

    it('deletes as normal within a cell', () => {
      const editor = createEditor([table([['ab']])]);

      // Place the cursor at the end of the cell's text
      Transforms.select(editor, SlateEditor.end(editor, [0, 0, 0]));

      editor.deleteBackward('character');

      expect(Node.string(editor.children[0])).toBe('a');
    });

    it('deletes an empty row on backspace in its first cell', () => {
      const editor = createEditor([
        table([
          ['a', 'b'],
          ['', ''],
          ['c', 'd'],
        ]),
      ]);

      // Place the cursor in the empty middle row's first cell
      Transforms.select(editor, SlateEditor.start(editor, [0, 1, 0]));

      editor.deleteBackward('character');

      const tableElement = editor.children[0] as TableElement;

      // The empty row is gone, and the cursor sits at the end of the row
      // above
      expect(tableElement.children).toHaveLength(2);
      expect(Node.string(tableElement)).toBe('abcd');
      expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 1]);
    });

    it('deletes an empty column on backspace in its empty header cell', () => {
      const editor = createEditor([
        table([
          ['a', ''],
          ['b', ''],
        ]),
      ]);

      // Place the cursor in the empty second column's header cell
      Transforms.select(editor, SlateEditor.start(editor, [0, 0, 1]));

      editor.deleteBackward('character');

      const tableElement = editor.children[0] as TableElement;

      // The column is gone, and the cursor sits at the end of the header
      // cell before it
      expect(
        (tableElement.children[0] as TableRowElement).children,
      ).toHaveLength(1);
      expect(tableElement.align).toEqual([null]);
      expect(Node.string(tableElement)).toBe('ab');
      expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 0]);
      expect(editor.selection?.anchor.offset).toBe(1);
    });

    it('deletes an empty first column, keeping the cursor in the header', () => {
      const editor = createEditor([
        table([
          ['', 'a'],
          ['', 'b'],
        ]),
      ]);

      // Place the cursor in the empty first column's header cell
      Transforms.select(editor, SlateEditor.start(editor, [0, 0, 0]));

      editor.deleteBackward('character');

      const tableElement = editor.children[0] as TableElement;

      // The column is gone, and the cursor sits in the header cell which
      // took its place
      expect(Node.string(tableElement)).toBe('ab');
      expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 0]);
    });

    it('keeps a column with content below its empty header', () => {
      const editor = createEditor([
        table([
          ['a', ''],
          ['b', 'c'],
        ]),
      ]);

      // Place the cursor in the empty header cell of a column with content
      Transforms.select(editor, SlateEditor.start(editor, [0, 0, 1]));

      editor.deleteBackward('character');

      const tableElement = editor.children[0] as TableElement;

      // Nothing is deleted, and the cursor moves to the previous cell
      expect(Node.string(tableElement)).toBe('abc');
      expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 0]);
    });

    it('keeps the table’s only column on backspace in its empty header', () => {
      const editor = createEditor([table([[''], ['a']])]);

      // Place the cursor in the single empty header cell
      Transforms.select(editor, SlateEditor.start(editor, [0, 0, 0]));

      editor.deleteBackward('character');

      // The table is untouched
      expect((editor.children[0] as TableElement).align).toEqual([null]);
    });

    it('keeps an empty header row on backspace in its first cell', () => {
      const editor = createEditor([
        table([
          ['', ''],
          ['c', 'd'],
        ]),
      ]);

      // Place the cursor in the empty header row's first cell
      Transforms.select(editor, SlateEditor.start(editor, [0, 0, 0]));

      editor.deleteBackward('character');

      // The table is untouched
      expect((editor.children[0] as TableElement).children).toHaveLength(2);
    });

    it('steps into the table’s last cell from the start of the block after it', () => {
      const editor = createEditor([
        table([['a', 'b']]),
        Ast.generateElement('paragraph', { children: [{ text: 'After' }] }),
      ]);

      // Place the cursor at the start of the paragraph
      Transforms.select(editor, SlateEditor.start(editor, [1]));

      editor.deleteBackward('character');

      // The paragraph keeps its content, and the cursor sits in the last cell
      expect(editor.children).toHaveLength(2);
      expect(Node.string(editor.children[1])).toBe('After');
      expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 1]);
    });

    it('dissolves an empty block after the table when stepping into it', () => {
      const editor = createEditor([
        table([['a', 'b']]),
        Ast.generateElement('paragraph'),
      ]);

      // Place the cursor in the empty paragraph
      Transforms.select(editor, SlateEditor.start(editor, [1]));

      editor.deleteBackward('character');

      // The paragraph is gone, and the cursor sits in the last cell
      expect(editor.children).toHaveLength(1);
      expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 1]);
    });
  });

  describe('deleteForward', () => {
    it('stops at the end of a cell', () => {
      const editor = createEditor([table([['a', 'b']])]);

      // Place the cursor at the end of the first cell
      Transforms.select(editor, SlateEditor.end(editor, [0, 0, 0]));

      editor.deleteForward('character');

      // The next cell was not pulled in
      expect(Node.string(editor.children[0])).toBe('ab');
    });

    it('steps into the table’s first cell from the end of the block before it', () => {
      const editor = createEditor([
        Ast.generateElement('paragraph', { children: [{ text: 'Before' }] }),
        table([['a', 'b']]),
      ]);

      // Place the cursor at the end of the paragraph
      Transforms.select(editor, SlateEditor.end(editor, [0]));

      editor.deleteForward('character');

      // The table is untouched, and the cursor sits in the first cell
      expect(editor.children).toHaveLength(2);
      expect(Node.string(editor.children[1])).toBe('ab');
      expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([1, 0, 0]);
    });

    it('dissolves an empty block before the table when stepping into it', () => {
      const editor = createEditor([
        Ast.generateElement('paragraph'),
        table([['a', 'b']]),
      ]);

      // Place the cursor in the empty paragraph
      Transforms.select(editor, SlateEditor.start(editor, [0]));

      editor.deleteForward('character');

      // The paragraph is gone, and the cursor sits in the first cell
      expect(editor.children).toHaveLength(1);
      expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 0]);
    });
  });

  describe('table shortcut', () => {
    it('turns a paragraph into a starter table around its content', () => {
      const editor = withTables(
        withBlockShortcuts(
          createTestEditor([
            Ast.generateElement('paragraph', {
              children: [{ text: 'Content' }],
            }),
          ]),
          [TableElementConfig],
        ),
      );

      // Type the shortcut at the start of the paragraph
      Transforms.select(editor, { path: [0, 0], offset: 0 });
      editor.insertText('|');
      editor.insertText(' ');

      const tableElement = editor.children[0] as TableElement;

      // The paragraph becomes a two column starter table with its content
      // in the first header cell
      expect(tableElement.type).toBe('table');
      expect(tableElement.align).toEqual([null, null]);
      expect(tableElement.children).toHaveLength(3);

      const headerRow = tableElement.children[0] as TableRowElement;

      expect(Node.string(headerRow.children[0])).toBe('Content');
    });
  });

  describe('deleteFragment', () => {
    it('removes a table fully covered by the deleted fragment', () => {
      const editor = createEditor([
        table([
          ['a', 'b'],
          ['c', 'd'],
        ]),
        Ast.generateElement('paragraph', { children: [{ text: 'After' }] }),
      ]);

      // Select the entire document
      Transforms.select(editor, {
        anchor: SlateEditor.start(editor, []),
        focus: SlateEditor.end(editor, []),
      });

      editor.deleteFragment();

      // No husk of the table survives, only an empty paragraph
      expect(editor.children).toHaveLength(1);
      expect((editor.children[0] as Element).type).toBe('paragraph');
      expect(Node.string(editor.children[0])).toBe('');
    });

    it('removes a fully covered table which ends the document', () => {
      const editor = createEditor([
        Ast.generateElement('paragraph', { children: [{ text: 'Before' }] }),
        table([
          ['a', 'b'],
          ['c', 'd'],
        ]),
      ]);

      // Select the entire document
      Transforms.select(editor, {
        anchor: SlateEditor.start(editor, []),
        focus: SlateEditor.end(editor, []),
      });

      editor.deleteFragment();

      // No husk of the table survives
      expect(
        editor.children.every((child) => (child as Element).type !== 'table'),
      ).toBe(true);
      expect(Node.string(editor)).toBe('');
    });

    it('keeps content merged in from beyond the fragment', () => {
      const editor = createEditor([
        table([['a', 'b']]),
        Ast.generateElement('paragraph', { children: [{ text: 'After' }] }),
      ]);

      // Select from the table's start into the middle of the paragraph
      Transforms.select(editor, {
        anchor: SlateEditor.start(editor, [0]),
        focus: { path: [1, 0], offset: 2 },
      });

      editor.deleteFragment();

      // The paragraph's remainder survives the delete
      expect(Node.string(editor)).toBe('ter');
    });

    it('leaves a partially covered table alone', () => {
      const editor = createEditor([
        table([['a', 'b']]),
        Ast.generateElement('paragraph', { children: [{ text: 'After' }] }),
      ]);

      // Select from the second cell to the end of the paragraph
      Transforms.select(editor, {
        anchor: SlateEditor.start(editor, [0, 0, 1]),
        focus: SlateEditor.end(editor, [1]),
      });

      editor.deleteFragment();

      // The table keeps its uncovered content
      expect((editor.children[0] as Element).type).toBe('table');
      expect(Node.string(editor.children[0])).toBe('a');
    });
  });

  describe('insertData', () => {
    it('degrades pasted content to a single line of text inside a cell', () => {
      const editor = createEditor([table([['a', 'b']])]);

      // Place the cursor at the end of the first cell
      Transforms.select(editor, SlateEditor.end(editor, [0, 0, 0]));

      // Paste two lines of text
      editor.insertData({
        getData: (format: string) =>
          format === 'text/plain' ? 'one\ntwo' : '',
      } as DataTransfer);

      // The lines land in the cell as a single line
      const tableElement = editor.children[0] as TableElement;
      const headerRow = tableElement.children[0] as TableRowElement;

      expect(Node.string(headerRow.children[0])).toBe('aone two');
      expect(headerRow.children).toHaveLength(2);
    });
  });
});
