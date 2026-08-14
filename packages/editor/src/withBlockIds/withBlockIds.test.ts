import { Editor as SlateEditor } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { Element } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import {
  cleanup,
  createTestEditor,
  headingElement1,
  linkElement1,
  paragraphElement1,
} from '../test-utils';
import { Editor } from '../types';
import { hasBlockId } from '../utils';
import { withBlockIds } from './withBlockIds';

// A paragraph containing an inline link element
const paragraphWithLink = {
  ...paragraphElement1,
  children: [{ text: 'Visit ' }, linkElement1, { text: '' }],
};

/**
 * Gets the block ID of the element at the given top level index.
 *
 * @param editor An editor instance.
 * @param index The index of the block.
 * @returns The block's ID, or null if it does not have one.
 */
function getBlockId(editor: Editor, index: number): string | null {
  const element = editor.children[index] as Element;

  return hasBlockId(element) ? element.id : null;
}

describe('withBlockIds', () => {
  afterEach(cleanup);

  it('assigns an ID to blocks which do not have one', () => {
    const editor = withBlockIds(
      createTestEditor([paragraphElement1, headingElement1]),
    );

    // Normalization assigns the IDs
    SlateEditor.normalize(editor, { force: true });

    expect(getBlockId(editor, 0)).toEqual(expect.any(String));
    expect(getBlockId(editor, 1)).toEqual(expect.any(String));
  });

  it('assigns a unique ID to each block', () => {
    const editor = withBlockIds(
      createTestEditor([paragraphElement1, headingElement1]),
    );

    SlateEditor.normalize(editor, { force: true });

    expect(getBlockId(editor, 0)).not.toBe(getBlockId(editor, 1));
  });

  it('gives a duplicated block a fresh ID', () => {
    const editor = withBlockIds(createTestEditor([paragraphElement1]));

    SlateEditor.normalize(editor, { force: true });

    const originalId = getBlockId(editor, 0);

    // Insert a copy of the block, carrying the same ID
    Transforms.insertNodes(editor, editor.children[0], { at: [1] });

    expect(getBlockId(editor, 0)).toBe(originalId);
    expect(getBlockId(editor, 1)).toEqual(expect.any(String));
    expect(getBlockId(editor, 1)).not.toBe(originalId);
  });

  it('keeps a block’s ID stable across edits', () => {
    const editor = withBlockIds(createTestEditor([paragraphElement1]));

    SlateEditor.normalize(editor, { force: true });

    const originalId = getBlockId(editor, 0);

    // Edit the block's text
    Transforms.insertText(editor, 'Added text', {
      at: SlateEditor.end(editor, [0]),
    });

    expect(getBlockId(editor, 0)).toBe(originalId);
  });

  it('does not assign IDs to inline elements', () => {
    const editor = withBlockIds(createTestEditor([paragraphWithLink]));

    SlateEditor.normalize(editor, { force: true });

    const [block] = editor.children as Element[];
    const inlineElement = block.children[1] as Element;

    expect(hasBlockId(inlineElement)).toBe(false);
  });
});
