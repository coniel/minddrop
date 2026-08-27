import { Node, Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Ast, TableElement } from '@minddrop/ast';
import { cleanup, createTestEditor, generateTestTable } from '../../test-utils';
import { insertTableRowBelow } from './insertTableRowBelow';

describe('insertTableRowBelow', () => {
  afterEach(cleanup);

  it('inserts a row below the current one, keeping the column', () => {
    const editor = createTestEditor([
      generateTestTable([
        ['a', 'b'],
        ['c', 'd'],
      ]),
    ]);

    // Place the cursor in the second header cell
    Transforms.select(editor, SlateEditor.end(editor, [0, 0, 1]));

    expect(insertTableRowBelow(editor)).toBe(true);

    const tableElement = editor.children[0] as TableElement;

    // An empty row lands between the two, and the cursor stays in its
    // column
    expect(tableElement.children).toHaveLength(3);
    expect(Node.string(tableElement.children[1])).toBe('');
    expect(editor.selection?.anchor.path.slice(0, 3)).toEqual([0, 1, 1]);
  });

  it('returns false outside a table', () => {
    const editor = createTestEditor([Ast.generateElement('paragraph')]);

    Transforms.select(editor, SlateEditor.start(editor, [0]));

    expect(insertTableRowBelow(editor)).toBe(false);
  });
});
