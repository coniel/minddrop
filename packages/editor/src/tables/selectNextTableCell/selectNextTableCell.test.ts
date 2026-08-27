import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Ast, TableElement } from '@minddrop/ast';
import { cleanup, createTestEditor, generateTestTable } from '../../test-utils';
import { selectNextTableCell } from './selectNextTableCell';

describe('selectNextTableCell', () => {
  afterEach(cleanup);

  it('selects the content of the next cell', () => {
    const editor = createTestEditor([
      generateTestTable([
        ['a', 'b'],
        ['c', 'd'],
      ]),
    ]);

    // Place the cursor in the first cell
    Transforms.select(editor, SlateEditor.start(editor, [0, 0, 0]));

    expect(selectNextTableCell(editor)).toBe(true);

    // The whole next cell is selected
    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 1]);
    expect(SlateEditor.string(editor, editor.selection!)).toBe('b');
  });

  it('wraps to the next row', () => {
    const editor = createTestEditor([
      generateTestTable([
        ['a', 'b'],
        ['c', 'd'],
      ]),
    ]);

    // Place the cursor in the header row's last cell
    Transforms.select(editor, SlateEditor.start(editor, [0, 0, 1]));

    selectNextTableCell(editor);

    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 1, 0]);
  });

  it('grows the table by a row in the table’s last cell', () => {
    const editor = createTestEditor([generateTestTable([['a', 'b']])]);

    // Place the cursor in the last cell
    Transforms.select(editor, SlateEditor.start(editor, [0, 0, 1]));

    expect(selectNextTableCell(editor)).toBe(true);

    const tableElement = editor.children[0] as TableElement;

    // The table gains an empty row, whose first cell holds the cursor
    expect(tableElement.children).toHaveLength(2);
    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 1, 0]);
  });

  it('returns false outside a table', () => {
    const editor = createTestEditor([Ast.generateElement('paragraph')]);

    Transforms.select(editor, SlateEditor.start(editor, [0]));

    expect(selectNextTableCell(editor)).toBe(false);
  });
});
