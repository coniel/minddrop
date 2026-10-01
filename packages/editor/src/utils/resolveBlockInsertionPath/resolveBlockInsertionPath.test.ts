import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, createTestEditor, paragraphElement1 } from '../../test-utils';
import { resolveBlockInsertionPath } from './resolveBlockInsertionPath';

describe('resolveBlockInsertionPath', () => {
  afterEach(cleanup);

  it('resolves the path below the block the cursor is in', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement1]);

    Transforms.select(editor, SlateEditor.start(editor, [0]));

    expect(resolveBlockInsertionPath(editor)).toEqual([1]);
  });

  it('resolves the end of the document without a cursor', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement1]);

    editor.selection = null;

    expect(resolveBlockInsertionPath(editor)).toEqual([2]);
  });
});
