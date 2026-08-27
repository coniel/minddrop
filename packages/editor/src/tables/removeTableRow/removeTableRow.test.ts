import { Node } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { TableElement } from '@minddrop/ast';
import { cleanup, createTestEditor, generateTestTable } from '../../test-utils';
import { removeTableRow } from './removeTableRow';

describe('removeTableRow', () => {
  afterEach(cleanup);

  it('removes the row at the given index', () => {
    const editor = createTestEditor([
      generateTestTable([
        ['a', 'b'],
        ['c', 'd'],
      ]),
    ]);

    removeTableRow(editor, [0], 1);

    const table = editor.children[0] as TableElement;

    expect(table.children).toHaveLength(1);
    expect(Node.string(table)).toBe('ab');
  });

  it('removes the table when removing its only row', () => {
    const editor = createTestEditor([generateTestTable([['a', 'b']])]);

    removeTableRow(editor, [0], 0);

    // Only the trailing empty paragraph the editor normalizes in remains
    expect(
      editor.children.every(
        (child) => (child as TableElement).type !== 'table',
      ),
    ).toBe(true);
  });
});
