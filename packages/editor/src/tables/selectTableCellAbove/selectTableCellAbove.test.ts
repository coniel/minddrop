import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Ast } from '@minddrop/ast';
import { cleanup, createTestEditor, generateTestTable } from '../../test-utils';
import { selectTableCellAbove } from './selectTableCellAbove';

describe('selectTableCellAbove', () => {
  afterEach(cleanup);

  it('moves to the cell above, keeping the column', () => {
    const editor = createTestEditor([
      generateTestTable([
        ['a', 'b'],
        ['c', 'd'],
      ]),
    ]);

    // Place the cursor in the second row's second cell
    Transforms.select(editor, SlateEditor.end(editor, [0, 1, 1]));

    expect(selectTableCellAbove(editor)).toBe(true);

    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 1]);
  });

  it('steps out to the block before the table from the header row', () => {
    const editor = createTestEditor([
      Ast.generateElement('paragraph', { children: [{ text: 'Before' }] }),
      generateTestTable([['a', 'b']]),
    ]);

    // Place the cursor in the header row
    Transforms.select(editor, SlateEditor.end(editor, [1, 0, 0]));

    expect(selectTableCellAbove(editor)).toBe(true);

    // The cursor sits at the end of the preceding block
    expect(editor.selection?.anchor.path[0]).toBe(0);
    expect(editor.selection?.anchor.offset).toBe('Before'.length);
  });

  it('stays put when the table starts the document', () => {
    const editor = createTestEditor([generateTestTable([['a', 'b']])]);

    // Place the cursor in the header row
    Transforms.select(editor, SlateEditor.end(editor, [0, 0, 0]));

    expect(selectTableCellAbove(editor)).toBe(true);

    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 0]);
  });

  it('returns false outside a table', () => {
    const editor = createTestEditor([Ast.generateElement('paragraph')]);

    Transforms.select(editor, SlateEditor.start(editor, [0]));

    expect(selectTableCellAbove(editor)).toBe(false);
  });
});
