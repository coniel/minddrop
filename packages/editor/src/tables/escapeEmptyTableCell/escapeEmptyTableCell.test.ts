import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Ast, Element } from '@minddrop/ast';
import { cleanup, createTestEditor, generateTestTable } from '../../test-utils';
import { escapeEmptyTableCell } from './escapeEmptyTableCell';

describe('escapeEmptyTableCell', () => {
  afterEach(cleanup);

  it('moves forward out of an empty cell into the next cell', () => {
    const editor = createTestEditor([generateTestTable([['a', '', 'c']])]);

    // Place the caret in the empty middle cell
    Transforms.select(editor, SlateEditor.start(editor, [0, 0, 1]));

    expect(escapeEmptyTableCell(editor, 'forward')).toBe(true);

    // The caret sits at the start of the next cell
    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 2]);
    expect(editor.selection?.anchor.offset).toBe(0);
  });

  it('moves backward out of an empty cell into the previous cell', () => {
    const editor = createTestEditor([generateTestTable([['a', '', 'c']])]);

    // Place the caret in the empty middle cell
    Transforms.select(editor, SlateEditor.start(editor, [0, 0, 1]));

    expect(escapeEmptyTableCell(editor, 'backward')).toBe(true);

    // The caret sits at the end of the previous cell
    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 0]);
    expect(editor.selection?.anchor.offset).toBe(1);
  });

  it('wraps between rows', () => {
    const editor = createTestEditor([
      generateTestTable([
        ['a', ''],
        ['c', 'd'],
      ]),
    ]);

    // Place the caret in the empty cell ending the header row
    Transforms.select(editor, SlateEditor.start(editor, [0, 0, 1]));

    escapeEmptyTableCell(editor, 'forward');

    // The caret moves to the next row's first cell
    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 1, 0]);
  });

  it('steps out to the block after the table from the last cell', () => {
    const editor = createTestEditor([
      generateTestTable([['a', '']]),
      Ast.generateElement('paragraph', { children: [{ text: 'After' }] }),
    ]);

    // Place the caret in the empty last cell
    Transforms.select(editor, SlateEditor.start(editor, [0, 0, 1]));

    expect(escapeEmptyTableCell(editor, 'forward')).toBe(true);

    // The caret sits at the start of the following block
    expect(editor.selection?.anchor.path[0]).toBe(1);
    expect(editor.selection?.anchor.offset).toBe(0);
  });

  it('adds a paragraph to exit into when the table ends the document', () => {
    const editor = createTestEditor([generateTestTable([['a', '']])]);

    // Place the caret in the empty last cell
    Transforms.select(editor, SlateEditor.start(editor, [0, 0, 1]));

    expect(escapeEmptyTableCell(editor, 'forward')).toBe(true);

    // A paragraph now follows the table, holding the caret
    expect(editor.children).toHaveLength(2);
    expect((editor.children[1] as Element).type).toBe('paragraph');
    expect(editor.selection?.anchor.path[0]).toBe(1);
  });

  it('steps out to the block before the table from the first cell', () => {
    const editor = createTestEditor([
      Ast.generateElement('paragraph', { children: [{ text: 'Before' }] }),
      generateTestTable([['', 'b']]),
    ]);

    // Place the caret in the empty first cell
    Transforms.select(editor, SlateEditor.start(editor, [1, 0, 0]));

    expect(escapeEmptyTableCell(editor, 'backward')).toBe(true);

    // The caret sits at the end of the preceding block
    expect(editor.selection?.anchor.path[0]).toBe(0);
    expect(editor.selection?.anchor.offset).toBe('Before'.length);
  });

  it('leaves cells with content to native movement', () => {
    const editor = createTestEditor([generateTestTable([['a', 'b']])]);

    // Place the caret in a cell with content
    Transforms.select(editor, SlateEditor.start(editor, [0, 0, 0]));

    expect(escapeEmptyTableCell(editor, 'forward')).toBe(false);
  });

  it('returns false outside a table', () => {
    const editor = createTestEditor([Ast.generateElement('paragraph')]);

    Transforms.select(editor, SlateEditor.start(editor, [0]));

    expect(escapeEmptyTableCell(editor, 'forward')).toBe(false);
  });
});
