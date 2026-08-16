import { Path, Editor as SlateEditor, Element as SlateElement } from 'slate';
import { Element } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { selectBlocks } from '../selectBlocks';
import { Editor } from '../types';
import {
  getContentStartIndex,
  opensInnermostFrame,
  resolveDroppedAncestry,
} from '../utils';

/**
 * Moves the given top level blocks to an insertion point, keeping
 * them selected where they land.
 *
 * The blocks take the depth they land at, keeping their nesting relative to
 * one another.
 *
 * @param editor An editor instance.
 * @param paths The paths of the blocks to move.
 * @param index The index to insert the blocks at.
 */
export function moveBlocksTo(
  editor: Editor,
  paths: Path[],
  index: number,
): void {
  // Nothing to move
  if (!paths.length) {
    return;
  }

  const sortedPaths = [...paths].sort(Path.compare);
  const firstIndex = sortedPaths[0][0];
  const lastIndex = sortedPaths[sortedPaths.length - 1][0];

  // Every insertion point within the run of blocks leaves them
  // where they already are
  if (index >= firstIndex && index <= lastIndex + 1) {
    return;
  }

  const elements = editor.children as Element[];
  const blocks = sortedPaths
    .map((path) => editor.children[path[0]])
    .filter((node) => SlateElement.isElement(node));

  // The blocks may no longer be in the document
  if (blocks.length !== sortedPaths.length) {
    return;
  }

  const reparented = reparentBlocks(elements, sortedPaths, index);

  // Blocks removed from above the insertion point shift it up
  const removedAbove = sortedPaths.filter((path) => path[0] < index).length;

  // Blocks never move above the title
  const insertIndex = Math.max(
    index - removedAbove,
    getContentStartIndex(editor),
  );

  SlateEditor.withoutNormalizing(editor, () => {
    // Removed last first so that the earlier paths remain valid
    for (
      let pathIndex = sortedPaths.length - 1;
      pathIndex >= 0;
      pathIndex -= 1
    ) {
      Transforms.removeNodes(editor, { at: sortedPaths[pathIndex] });
    }

    // Re-inserted rather than moved one by one, which would shift
    // the paths of the blocks still to be moved
    Transforms.insertNodes(editor, reparented, { at: [insertIndex] });

    selectBlocks(editor, [insertIndex], [insertIndex + blocks.length - 1]);
  });
}

/**
 * Returns the blocks being moved with their containers rewritten for where
 * they land.
 *
 * @param elements - The document's blocks.
 * @param paths - The paths of the blocks being moved, in document order.
 * @param index - The index the blocks are inserted at.
 * @returns The blocks, ready to be inserted.
 */
function reparentBlocks(
  elements: Element[],
  paths: Path[],
  index: number,
): Element[] {
  const rootAncestry = elements[paths[0][0]].ancestry || [];
  const aboveAncestry = elements[index - 1]?.ancestry || [];

  // A block whose innermost container was opened by the block above it in
  // its old position is carrying that container rather than opening it
  const opensContainer = opensInnermostFrame(elements, paths[0][0]);
  const droppedAncestry = resolveDroppedAncestry(aboveAncestry, opensContainer);

  // The containers the run was sitting in, which are the ones it is leaving
  // behind. A run led by a block which opens a container keeps that
  // container, so only the containers around it are context.
  const contextLength = opensContainer
    ? rootAncestry.length - 1
    : rootAncestry.length;

  return paths.map((path) => {
    const element = elements[path[0]];
    const ancestry = element.ancestry || [];
    // Only the containers the run is leaving are replaced, so a block keeps
    // its own containers whether it is nested inside the block leading the
    // run or sitting alongside it
    const nextAncestry = [...droppedAncestry, ...ancestry.slice(contextLength)];

    // A block which lands in no container carries no ancestry at all
    if (!nextAncestry.length) {
      const { ancestry: dropped, ...unframed } = element;

      return unframed;
    }

    return { ...element, ancestry: nextAncestry };
  });
}
