import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import {
  Ast,
  TableCellElement,
  TableElement,
  TableRowElement,
} from '@minddrop/ast';
import { cleanup, createTestEditor, paragraphElement1 } from '../../test-utils';
import { getTableCellEntry } from './getTableCellEntry';

// A one row, two column table
const tableElement = Ast.generateElement<TableElement>('table', {
  align: [null, null],
  children: [
    Ast.generateElement<TableRowElement>('table-row', {
      children: [
        Ast.generateElement<TableCellElement>('table-cell', {
          children: [{ text: 'a' }],
        }),
        Ast.generateElement<TableCellElement>('table-cell', {
          children: [{ text: 'b' }],
        }),
      ],
    }),
  ],
});

describe('getTableCellEntry', () => {
  afterEach(cleanup);

  it('returns the cell, row and table around the selection', () => {
    const editor = createTestEditor([tableElement]);

    // Place the cursor in the second cell
    Transforms.select(editor, SlateEditor.start(editor, [0, 0, 1]));

    const entry = getTableCellEntry(editor);

    expect(entry?.cell[1]).toEqual([0, 0, 1]);
    expect(entry?.row[1]).toEqual([0, 0]);
    expect(entry?.table[1]).toEqual([0]);
  });

  it('returns the cell around a given location', () => {
    const editor = createTestEditor([paragraphElement1, tableElement]);

    // The cursor sits outside the table
    Transforms.select(editor, SlateEditor.start(editor, [0]));

    const entry = getTableCellEntry(editor, { at: [1, 0, 0, 0] });

    expect(entry?.cell[1]).toEqual([1, 0, 0]);
  });

  it('returns null outside a table', () => {
    const editor = createTestEditor([paragraphElement1]);

    // Place the cursor in the paragraph
    Transforms.select(editor, SlateEditor.start(editor, [0]));

    expect(getTableCellEntry(editor)).toBeNull();
  });

  it('returns null without a selection', () => {
    const editor = createTestEditor([tableElement]);

    // Drop the selection the test editor places at the end of the content
    Transforms.deselect(editor);

    expect(getTableCellEntry(editor)).toBeNull();
  });
});
