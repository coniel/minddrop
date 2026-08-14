import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  titleElement1,
} from '../test-utils';
import { getBlockAlignedRange } from '../utils';
import { insertBlocksAt } from './insertBlocksAt';

describe('insertBlocksAt', () => {
  afterEach(cleanup);

  it('inserts the blocks at the insertion point', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    insertBlocksAt(editor, [paragraphElement3], 1);

    expect(editor.children).toEqual([
      paragraphElement1,
      paragraphElement3,
      paragraphElement2,
    ]);
  });

  it('inserts several blocks together', () => {
    const editor = createTestEditor([paragraphElement1]);

    insertBlocksAt(editor, [paragraphElement2, paragraphElement3], 1);

    expect(editor.children).toEqual([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
    ]);
  });

  it('selects the blocks where they land', () => {
    const editor = createTestEditor([paragraphElement1]);

    insertBlocksAt(editor, [paragraphElement2, paragraphElement3], 1);

    expect(getBlockAlignedRange(editor)).toEqual({
      firstIndex: 1,
      lastIndex: 2,
    });
  });

  it('never inserts above the title', () => {
    const editor = createTestEditor([titleElement1, paragraphElement1]);

    insertBlocksAt(editor, [paragraphElement2], 0);

    expect(editor.children).toEqual([
      titleElement1,
      paragraphElement2,
      paragraphElement1,
    ]);
  });

  it('does nothing without blocks to insert', () => {
    const editor = createTestEditor([paragraphElement1]);

    insertBlocksAt(editor, [], 1);

    expect(editor.children).toEqual([paragraphElement1]);
  });
});
