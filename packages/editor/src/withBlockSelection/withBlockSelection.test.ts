import { Range, Editor as SlateEditor } from 'slate';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Element } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  setup,
  titleElement1,
} from '../test-utils';
import { Editor } from '../types';
import { getBlockAlignedRange } from '../utils';
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
  return withBlockSelection(createTestEditor(content));
}

/**
 * Waits for Slate to flush its operations, which it does in a
 * microtask, and with them the plugin's `onChange`.
 */
function flushOperations(): Promise<void> {
  return Promise.resolve();
}

describe('withBlockSelection', () => {
  beforeEach(setup);

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

  it('leaves block mode when the selection no longer covers whole blocks', async () => {
    const editor = createEditor([
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
    ]);

    editor.blockSelectionMode = true;

    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [0]),
    });

    await flushOperations();

    // Place a cursor inside the block
    Transforms.select(editor, { path: [0, 0], offset: 4 });

    await flushOperations();

    expect(editor.blockSelectionMode).toBe(false);
  });

  it('stays in block mode while whole blocks are covered', async () => {
    const editor = createEditor();

    editor.blockSelectionMode = true;

    Transforms.select(editor, {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [0]),
    });

    await flushOperations();

    expect(editor.blockSelectionMode).toBe(true);
  });
});
