import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Selection, SelectionItemSerializers } from '@minddrop/selection';
import { selectBlocks } from '../selectBlocks';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement1PlainText,
  paragraphElement2,
  paragraphElement2PlainText,
  paragraphElement3,
} from '../test-utils';
import { BLOCK_SELECTION_ITEM_TYPE, Editor } from '../types';
import { assignBlockIds } from '../withBlockIds';
import { registerBlockSelectionSerializer } from './registerBlockSelectionSerializer';

/**
 * Creates an editor whose blocks carry block IDs, which the app's
 * selection identifies them by.
 *
 * @returns The editor.
 */
function createEditor(): Editor {
  return createTestEditor(
    assignBlockIds([paragraphElement1, paragraphElement2, paragraphElement3]),
  );
}

/**
 * Gets the registered block serializer.
 *
 * @returns The serializer.
 */
function getSerializer() {
  const serializer = SelectionItemSerializers.get(BLOCK_SELECTION_ITEM_TYPE);

  if (!serializer) {
    throw new Error('The block selection serializer is not registered');
  }

  return serializer;
}

describe('registerBlockSelectionSerializer', () => {
  beforeEach(() => {
    registerBlockSelectionSerializer();
  });

  afterEach(() => {
    cleanup();

    SelectionItemSerializers.unregister(BLOCK_SELECTION_ITEM_TYPE);
  });

  it('serializes the selected blocks to markdown', () => {
    const editor = createEditor();

    selectBlocks(editor, [0], [1]);

    expect(getSerializer().toPlainText?.(Selection.get())).toBe(
      `${paragraphElement1PlainText}\n\n${paragraphElement2PlainText}`,
    );
  });

  it('serializes the selected blocks to their elements', () => {
    const editor = createEditor();

    selectBlocks(editor, [0], [0]);

    const serialized = getSerializer().toJsonString?.(Selection.get()) ?? '';

    expect(JSON.parse(serialized)).toEqual([editor.children[0]]);
  });

  it('deletes the selected blocks from their editor', () => {
    const editor = createEditor();

    selectBlocks(editor, [0], [0]);

    getSerializer().delete?.(Selection.get());

    expect(editor.children).toHaveLength(2);
    expect(editor.children[0]).toEqual(
      expect.objectContaining({ type: 'paragraph' }),
    );
  });
});
