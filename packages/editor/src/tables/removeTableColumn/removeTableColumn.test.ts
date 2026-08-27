import { Node } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Element, TableElement, TableRowElement } from '@minddrop/ast';
import { cleanup, createTestEditor, generateTestTable } from '../../test-utils';
import { removeTableColumn } from './removeTableColumn';

describe('removeTableColumn', () => {
  afterEach(cleanup);

  it('removes the cell at the given index from every row', () => {
    const editor = createTestEditor([
      generateTestTable(
        [
          ['a', 'b'],
          ['c', 'd'],
        ],
        ['left', 'right'],
      ),
    ]);

    removeTableColumn(editor, [0], 0);

    const table = editor.children[0] as TableElement;

    // Every row loses its first cell
    table.children.forEach((row) => {
      expect((row as TableRowElement).children).toHaveLength(1);
    });
    expect(Node.string(table)).toBe('bd');

    // The column's alignment goes with it
    expect(table.align).toEqual(['right']);
  });

  it('removes the table when removing its only column', () => {
    const editor = createTestEditor([generateTestTable([['a'], ['b']])]);

    removeTableColumn(editor, [0], 0);

    expect(
      editor.children.every((child) => (child as Element).type !== 'table'),
    ).toBe(true);
  });
});
