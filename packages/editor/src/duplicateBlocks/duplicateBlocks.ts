import { Path, Element as SlateElement } from 'slate';
import { Element } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { selectBlocks } from '../selectBlocks';
import { Editor } from '../types';
import { hasBlockId } from '../utils';

/**
 * Inserts a copy of the given top level blocks below the last of
 * them, and selects the copies.
 *
 * @param editor An editor instance.
 * @param paths The paths of the blocks to duplicate.
 */
export function duplicateBlocks(editor: Editor, paths: Path[]): void {
  // Nothing to duplicate
  if (!paths.length) {
    return;
  }

  const sortedPaths = [...paths].sort(Path.compare);

  const copies = sortedPaths
    .map((path) => editor.children[path[0]])
    .filter((node) => SlateElement.isElement(node))
    .map(copyBlock);

  // The blocks may no longer be in the document
  if (!copies.length) {
    return;
  }

  // The copies go directly below the blocks they were made from
  const firstCopyIndex = sortedPaths[sortedPaths.length - 1][0] + 1;

  Transforms.insertNodes(editor, copies, { at: [firstCopyIndex] });

  // Carry the selection over to the copies, so that repeating the
  // action duplicates them rather than the originals
  selectBlocks(editor, [firstCopyIndex], [firstCopyIndex + copies.length - 1]);
}

/**
 * Copies a block, leaving the copy without a block ID.
 *
 * @param element The block to copy.
 * @returns The copy.
 */
function copyBlock(element: Element): Element {
  // Deep copied because Slate tracks nodes by object identity, so
  // the copy cannot share any part of the original.
  const copy = structuredClone(element);

  // The block ID plugin gives the copy an ID of its own
  if (hasBlockId(copy)) {
    const { id, ...copyWithoutId } = copy;

    return copyWithoutId;
  }

  return copy;
}
