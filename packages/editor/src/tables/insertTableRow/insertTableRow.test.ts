import { Node } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Element, TableElement, TableRowElement } from '@minddrop/ast';
import { cleanup, createTestEditor, generateTestTable } from '../../test-utils';
import { insertTableRow } from './insertTableRow';

describe('insertTableRow', () => {
  afterEach(cleanup);

  it('inserts an empty row at the given index', () => {
    const editor = createTestEditor([
      generateTestTable([
        ['a', 'b'],
        ['c', 'd'],
      ]),
    ]);

    // Insert a row between the two existing ones
    insertTableRow(editor, [0], 1);

    const table = editor.children[0] as TableElement;

    expect(table.children).toHaveLength(3);

    // The new row matches the column count and is empty
    const newRow = table.children[1] as TableRowElement;

    expect(newRow.children).toHaveLength(2);
    expect(Node.string(newRow)).toBe('');

    // The cursor sits in the new row's first cell
    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 1, 0]);
  });

  it('does nothing when the path is not a table', () => {
    const editor = createTestEditor();

    insertTableRow(editor, [0], 0);

    expect((editor.children[0] as Element).type).toBe('paragraph');
  });
});
