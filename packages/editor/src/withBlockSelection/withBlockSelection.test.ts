import { Range } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Element } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { selectBlocks } from '../selectBlocks';
import {
  cleanup,
  createTestEditorWithBlockIds,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  titleElement1,
} from '../test-utils';
import { Editor } from '../types';
import { getBlockAlignedRange, getSelectedBlocks } from '../utils';
import { withBlockSelection } from './withBlockSelection';

/**
 * Creates an editor with the plugin applied and the given content.
 *
 * @param content The editor's content.
 * @returns The editor.
 */
function createEditor(
  content: Element[] = [paragraphElement1, paragraphElement2],
): Editor {
  // Blocks carry the IDs the app's selection identifies them by
  return withBlockSelection(createTestEditorWithBlockIds(content));
}

/**
 * Waits for Slate to flush its operations, which it does in a
 * microtask, and with them the plugin's `onChange`.
 */
function flushOperations(): Promise<void> {
  return Promise.resolve();
}

describe('withBlockSelection', () => {
  afterEach(cleanup);

  it('covers whole blocks when the selection crosses a block boundary', async () => {
    const editor = createEditor();

    // Runs from part way through the first block to part way
    // through the second
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 4 },
      focus: { path: [1, 0], offset: 4 },
    });

    await flushOperations();

    expect(getBlockAlignedRange(editor)).toEqual({
      firstIndex: 0,
      lastIndex: 1,
    });
  });

  it('keeps the direction of a backwards selection', async () => {
    const editor = createEditor();

    Transforms.select(editor, {
      anchor: { path: [1, 0], offset: 4 },
      focus: { path: [0, 0], offset: 4 },
    });

    await flushOperations();

    expect(editor.selection && Range.isBackward(editor.selection)).toBe(true);
    expect(getBlockAlignedRange(editor)).toEqual({
      firstIndex: 0,
      lastIndex: 1,
    });
  });

  it('leaves a selection within a single block alone', async () => {
    const editor = createEditor();

    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 4 },
    });

    await flushOperations();

    expect(editor.selection?.focus.offset).toBe(4);
  });

  it('leaves a selection reaching into the title alone', async () => {
    const editor = createEditor([
      titleElement1,
      paragraphElement1,
      paragraphElement2,
    ]);

    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 4 },
      focus: { path: [1, 0], offset: 4 },
    });

    await flushOperations();

    expect(editor.selection?.anchor.offset).toBe(4);
  });

  it('selects the blocks it covers in the app’s selection', async () => {
    const editor = createEditor();

    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 4 },
      focus: { path: [1, 0], offset: 4 },
    });

    await flushOperations();

    expect(getSelectedBlocks(editor).map(([, path]) => path)).toEqual([
      [0],
      [1],
    ]);
  });

  it('deselects the blocks when the selection no longer covers whole blocks', async () => {
    const editor = createEditor([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
    ]);

    selectBlocks(editor, [0], [1]);

    await flushOperations();

    // Place a cursor inside a block
    Transforms.select(editor, { path: [0, 0], offset: 4 });

    await flushOperations();

    expect(getSelectedBlocks(editor)).toEqual([]);
  });

  it('keeps the blocks selected while whole blocks are covered', async () => {
    const editor = createEditor();

    selectBlocks(editor, [0], [0]);

    await flushOperations();

    expect(getSelectedBlocks(editor)).not.toEqual([]);
  });
});
