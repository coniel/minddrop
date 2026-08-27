import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Ast, Element } from '@minddrop/ast';
import { cleanup, createTestEditor, generateTestTable } from '../../test-utils';
import { exitTableBelow } from './exitTableBelow';

describe('exitTableBelow', () => {
  afterEach(cleanup);

  it('moves the cursor to the block after the table', () => {
    const editor = createTestEditor([
      generateTestTable([['a', 'b']]),
      Ast.generateElement('paragraph', { children: [{ text: 'After' }] }),
    ]);

    // Place the cursor inside the table
    Transforms.select(editor, SlateEditor.start(editor, [0, 0, 0]));

    exitTableBelow(editor, [0]);

    // The cursor sits at the start of the following block
    expect(editor.selection?.anchor.path[0]).toBe(1);
    expect(editor.selection?.anchor.offset).toBe(0);
  });

  it('adds a paragraph when the table ends the document', () => {
    const editor = createTestEditor([generateTestTable([['a', 'b']])]);

    // Place the cursor inside the table
    Transforms.select(editor, SlateEditor.start(editor, [0, 0, 0]));

    exitTableBelow(editor, [0]);

    // A paragraph now follows the table, holding the cursor
    expect(editor.children).toHaveLength(2);
    expect((editor.children[1] as Element).type).toBe('paragraph');
    expect(editor.selection?.anchor.path[0]).toBe(1);
  });
});
