import { Path, Editor as SlateEditor, Element as SlateElement } from 'slate';
import { Transforms } from '../Transforms';
import { selectBlocks } from '../selectBlocks';
import { Editor } from '../types';
import { getContentStartIndex } from '../utils';

/**
 * Moves the given top level blocks to an insertion point, keeping
 * them selected where they land.
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

  const blocks = sortedPaths
    .map((path) => editor.children[path[0]])
    .filter((node) => SlateElement.isElement(node));

  // The blocks may no longer be in the document
  if (blocks.length !== sortedPaths.length) {
    return;
  }

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
    Transforms.insertNodes(editor, blocks, { at: [insertIndex] });

    selectBlocks(editor, [insertIndex], [insertIndex + blocks.length - 1]);
  });
}
