import { Node } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { TableElement, TableRowElement } from '@minddrop/ast';
import { cleanup, createTestEditor, generateTestTable } from '../../test-utils';
import { insertTableColumn } from './insertTableColumn';

describe('insertTableColumn', () => {
  afterEach(cleanup);

  it('inserts an empty cell into every row at the given index', () => {
    const editor = createTestEditor([
      generateTestTable(
        [
          ['a', 'b'],
          ['c', 'd'],
        ],
        ['left', 'right'],
      ),
    ]);

    // Insert a column between the two existing ones
    insertTableColumn(editor, [0], 1);

    const table = editor.children[0] as TableElement;

    // Every row gains an empty middle cell
    table.children.forEach((row) => {
      const cells = (row as TableRowElement).children;

      expect(cells).toHaveLength(3);
      expect(Node.string(cells[1])).toBe('');
    });

    // The new column has no alignment, and the others keep theirs
    expect(table.align).toEqual(['left', null, 'right']);

    // The cursor sits in the new column's header cell
    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 1]);
  });
});
