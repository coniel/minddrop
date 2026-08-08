import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  setup,
  titleElement1,
} from '../test-utils';
import { moveBlocks } from './moveBlocks';

describe('moveBlocks', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('moves the blocks up', () => {
    const editor = createTestEditor([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
    ]);

    moveBlocks(editor, [[1], [2]], 'up');

    expect(editor.children).toEqual([
      paragraphElement2,
      paragraphElement3,
      paragraphElement1,
    ]);
  });

  it('moves the blocks down', () => {
    const editor = createTestEditor([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
    ]);

    moveBlocks(editor, [[0], [1]], 'down');

    expect(editor.children).toEqual([
      paragraphElement3,
      paragraphElement1,
      paragraphElement2,
    ]);
  });

  it('does nothing at the top of the content', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    moveBlocks(editor, [[0]], 'up');

    expect(editor.children).toEqual([paragraphElement1, paragraphElement2]);
  });

  it('does nothing at the end of the content', () => {
    const editor = createTestEditor([paragraphElement1, paragraphElement2]);

    moveBlocks(editor, [[1]], 'down');

    expect(editor.children).toEqual([paragraphElement1, paragraphElement2]);
  });

  it('does not move a block above the title', () => {
    const editor = createTestEditor([
      titleElement1,
      paragraphElement1,
      paragraphElement2,
    ]);

    moveBlocks(editor, [[1]], 'up');

    expect(editor.children).toEqual([
      titleElement1,
      paragraphElement1,
      paragraphElement2,
    ]);
  });
});
