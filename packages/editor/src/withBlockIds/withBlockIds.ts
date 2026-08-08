import {
  Editor as SlateEditor,
  Element as SlateElement,
  Node as SlateNode,
} from 'slate';
import { Element } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { Editor, IdentifiedElement } from '../types';
import { generateBlockId, hasBlockId } from '../utils';

/**
 * Gives every top level block element a session scoped ID, which
 * remains stable for as long as the element exists in the editor.
 *
 * Blocks are checked as a group rather than individually because
 * Slate replaces node objects on every change, making a node's
 * identity impossible to track by reference. A block which was
 * duplicated or pasted instead shows up as a repeated ID amongst
 * its siblings, and is given a fresh one.
 *
 * @param editor An editor instance.
 * @returns The editor instance with the plugin behaviour applied.
 */
export function withBlockIds(editor: Editor): Editor {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry, options) => {
    const [node, path] = entry;

    // Top level blocks are the editor node's children, so the
    // other nodes are of no interest.
    if (!SlateEditor.isEditor(node) || path.length > 0) {
      normalizeNode(entry, options);

      return;
    }

    const index = getBlockIndexNeedingId(node.children);

    // Assign one ID per pass, letting Slate run the normalization
    // again to pick up the next block needing one.
    if (index !== null) {
      Transforms.setNodes<IdentifiedElement>(
        editor,
        { id: generateBlockId() },
        { at: [index] },
      );

      return;
    }

    normalizeNode(entry, options);
  };

  return editor;
}

/**
 * Finds the first block which has no ID, or which shares its ID
 * with an earlier sibling.
 *
 * @param blocks The editor's top level nodes.
 * @returns The index of the block needing an ID, or null if every block has a unique one.
 */
function getBlockIndexNeedingId(blocks: SlateNode[]): number | null {
  // The IDs claimed by the blocks checked so far
  const claimedIds = new Set<string>();

  for (const [index, block] of blocks.entries()) {
    // Text nodes are not blocks
    if (!SlateElement.isElement(block)) {
      continue;
    }

    const element = block as Element;

    // Blocks without an ID need one
    if (!hasBlockId(element)) {
      return index;
    }

    // Blocks sharing an ID with an earlier sibling need a new one
    if (claimedIds.has(element.id)) {
      return index;
    }

    claimedIds.add(element.id);
  }

  return null;
}
