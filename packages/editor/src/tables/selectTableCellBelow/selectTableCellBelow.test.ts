import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Ast, Element } from '@minddrop/ast';
import { cleanup, createTestEditor, generateTestTable } from '../../test-utils';
import { selectTableCellBelow } from './selectTableCellBelow';

describe('selectTableCellBelow', () => {
  afterEach(cleanup);

  it('moves to the cell below, keeping the column', () => {
    const editor = createTestEditor([
      generateTestTable([
        ['a', 'b'],
        ['c', 'd'],
      ]),
    ]);

    // Place the cursor in the second header cell
    Transforms.select(editor, SlateEditor.end(editor, [0, 0, 1]));

    expect(selectTableCellBelow(editor)).toBe(true);

    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 1, 1]);
  });

  it('steps out to the block after the table from the last row', () => {
    const editor = createTestEditor([
      generateTestTable([['a', 'b']]),
      Ast.generateElement('paragraph', { children: [{ text: 'After' }] }),
    ]);

    // Place the cursor in the last row
    Transforms.select(editor, SlateEditor.end(editor, [0, 0, 0]));

    expect(selectTableCellBelow(editor)).toBe(true);

    // The cursor sits at the start of the following block
    expect(editor.selection?.anchor.path[0]).toBe(1);
    expect(editor.selection?.anchor.offset).toBe(0);
  });

  it('adds a paragraph to exit into when the table ends the document', () => {
    const editor = createTestEditor([generateTestTable([['a', 'b']])]);

    // Place the cursor in the last row
    Transforms.select(editor, SlateEditor.end(editor, [0, 0, 0]));

    expect(selectTableCellBelow(editor)).toBe(true);

    // A paragraph now follows the table, holding the cursor
    expect(editor.children).toHaveLength(2);
    expect((editor.children[1] as Element).type).toBe('paragraph');
    expect(editor.selection?.anchor.path[0]).toBe(1);
  });

  it('returns false outside a table', () => {
    const editor = createTestEditor([Ast.generateElement('paragraph')]);

    Transforms.select(editor, SlateEditor.start(editor, [0]));

    expect(selectTableCellBelow(editor)).toBe(false);
  });
});
