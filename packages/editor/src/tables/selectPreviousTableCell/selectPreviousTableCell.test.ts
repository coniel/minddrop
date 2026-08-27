import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Ast } from '@minddrop/ast';
import { cleanup, createTestEditor, generateTestTable } from '../../test-utils';
import { selectPreviousTableCell } from './selectPreviousTableCell';

describe('selectPreviousTableCell', () => {
  afterEach(cleanup);

  it('selects the content of the previous cell', () => {
    const editor = createTestEditor([
      generateTestTable([
        ['a', 'b'],
        ['c', 'd'],
      ]),
    ]);

    // Place the cursor in the second cell
    Transforms.select(editor, SlateEditor.start(editor, [0, 0, 1]));

    expect(selectPreviousTableCell(editor)).toBe(true);

    // The whole previous cell is selected
    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 0]);
    expect(SlateEditor.string(editor, editor.selection!)).toBe('a');
  });

  it('wraps to the previous row', () => {
    const editor = createTestEditor([
      generateTestTable([
        ['a', 'b'],
        ['c', 'd'],
      ]),
    ]);

    // Place the cursor in the second row's first cell
    Transforms.select(editor, SlateEditor.start(editor, [0, 1, 0]));

    selectPreviousTableCell(editor);

    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 1]);
  });

  it('stays put in the table’s first cell', () => {
    const editor = createTestEditor([generateTestTable([['a', 'b']])]);

    // Place the cursor in the first cell
    Transforms.select(editor, SlateEditor.start(editor, [0, 0, 0]));

    // The keystroke is still consumed by the table
    expect(selectPreviousTableCell(editor)).toBe(true);
    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 0]);
  });

  it('returns false outside a table', () => {
    const editor = createTestEditor([Ast.generateElement('paragraph')]);

    Transforms.select(editor, SlateEditor.start(editor, [0]));

    expect(selectPreviousTableCell(editor)).toBe(false);
  });
});
