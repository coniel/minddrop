import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Ast } from '@minddrop/ast';
import { cleanup, createTestEditor, generateTestTable } from '../../test-utils';
import { selectTableCellContent } from './selectTableCellContent';

describe('selectTableCellContent', () => {
  afterEach(cleanup);

  it('selects the whole content of the cell', () => {
    const editor = createTestEditor([generateTestTable([['abc', 'b']])]);

    // Place the caret inside the first cell
    Transforms.select(editor, SlateEditor.start(editor, [0, 0, 0]));

    expect(selectTableCellContent(editor)).toBe(true);

    // The cell's entire content is selected
    expect(SlateEditor.string(editor, editor.selection!)).toBe('abc');
    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 0, 0]);
    expect(editor.selection?.focus.path.slice(0, 3)).toEqual([0, 0, 0]);
  });

  it('declines when the cell is already fully selected', () => {
    const editor = createTestEditor([generateTestTable([['abc', 'b']])]);

    // Select the first cell's whole content
    Transforms.select(editor, SlateEditor.range(editor, [0, 0, 0]));

    // The keystroke falls through, expanding to the document
    expect(selectTableCellContent(editor)).toBe(false);
  });

  it('returns false outside a table', () => {
    const editor = createTestEditor([
      Ast.generateElement('paragraph', { children: [{ text: 'Text' }] }),
    ]);

    Transforms.select(editor, SlateEditor.start(editor, [0]));

    expect(selectTableCellContent(editor)).toBe(false);
  });
});
