import { Range } from 'slate';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Ast } from '@minddrop/ast';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  setup,
  titleElement1,
} from '../test-utils';
import { deleteBlocks } from './deleteBlocks';

describe('deleteBlocks', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the given blocks', () => {
    const editor = createTestEditor([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
    ]);

    deleteBlocks(editor, [[0], [1]]);

    expect(editor.children).toEqual([paragraphElement3]);
  });

  it('places the cursor in the block which took their place', () => {
    const editor = createTestEditor([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
    ]);

    deleteBlocks(editor, [[0]]);

    expect(editor.selection && Range.isCollapsed(editor.selection)).toBe(true);
    expect(editor.selection?.anchor).toEqual({ path: [0, 0], offset: 0 });
  });

  it('places the cursor at the end of the content when the last blocks are removed', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    deleteBlocks(editor, [[1]]);

    expect(editor.selection?.anchor).toEqual({
      path: [0, 0],
      offset: Ast.toPlainText([paragraphElement1]).length,
    });
  });

  it('leaves an empty paragraph when all of the content is removed', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    deleteBlocks(editor, [[0], [1]]);

    expect(editor.children).toEqual([Ast.generateElement('paragraph')]);
  });

  it('leaves an empty paragraph below the title', () => {
    const editor = createTestEditor([titleElement1, paragraphElement1]);

    deleteBlocks(editor, [[1]]);

    expect(editor.children).toEqual([
      titleElement1,
      Ast.generateElement('paragraph'),
    ]);
  });
});
