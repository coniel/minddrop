import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Ast, Element } from '@minddrop/ast';
import { cleanup, createTestEditor, generateTestTable } from '../../test-utils';
import { exitTableForward } from './exitTableForward';

describe('exitTableForward', () => {
  afterEach(cleanup);

  it('exits to the block after the table from the end of its last cell', () => {
    const editor = createTestEditor([
      generateTestTable([['a', 'b']]),
      Ast.generateElement('paragraph', { children: [{ text: 'After' }] }),
    ]);

    // Place the caret at the very end of the last cell
    Transforms.select(editor, SlateEditor.end(editor, [0, 0, 1]));

    expect(exitTableForward(editor)).toBe(true);

    // The caret sits at the start of the following block
    expect(editor.selection?.anchor.path[0]).toBe(1);
    expect(editor.selection?.anchor.offset).toBe(0);
  });

  it('adds a paragraph to exit into when the table ends the document', () => {
    const editor = createTestEditor([generateTestTable([['a', 'b']])]);

    // Place the caret at the very end of the last cell
    Transforms.select(editor, SlateEditor.end(editor, [0, 0, 1]));

    expect(exitTableForward(editor)).toBe(true);

    // A paragraph now follows the table, holding the caret
    expect(editor.children).toHaveLength(2);
    expect((editor.children[1] as Element).type).toBe('paragraph');
    expect(editor.selection?.anchor.path[0]).toBe(1);
  });

  it('declines anywhere but the table’s very end', () => {
    const editor = createTestEditor([generateTestTable([['a', 'b']])]);

    // Place the caret at the end of the first cell
    Transforms.select(editor, SlateEditor.end(editor, [0, 0, 0]));

    expect(exitTableForward(editor)).toBe(false);
  });

  it('returns false outside a table', () => {
    const editor = createTestEditor([Ast.generateElement('paragraph')]);

    Transforms.select(editor, SlateEditor.start(editor, [0]));

    expect(exitTableForward(editor)).toBe(false);
  });
});
