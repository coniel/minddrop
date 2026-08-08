import { Path } from 'slate';
import { Transforms } from '../Transforms';
import { Editor } from '../types';
import { getContentStartIndex } from '../utils';

export type BlockMoveDirection = 'up' | 'down';

/**
 * Moves the given top level blocks one position up or down,
 * keeping them selected.
 *
 * @param editor An editor instance.
 * @param paths The paths of the blocks to move.
 * @param direction The direction to move the blocks in.
 */
export function moveBlocks(
  editor: Editor,
  paths: Path[],
  direction: BlockMoveDirection,
): void {
  // Nothing to move
  if (!paths.length) {
    return;
  }

  const sortedPaths = [...paths].sort(Path.compare);
  const firstIndex = sortedPaths[0][0];
  const lastIndex = sortedPaths[sortedPaths.length - 1][0];

  if (direction === 'up') {
    // The blocks are already at the top of the content
    if (firstIndex <= getContentStartIndex(editor)) {
      return;
    }

    // Moving the block above the run down past it takes fewer
    // operations than moving each of the blocks up, and leaves the
    // selected blocks' paths shifted as a group.
    Transforms.moveNodes(editor, { at: [firstIndex - 1], to: [lastIndex] });

    return;
  }

  // The blocks are already at the end of the content
  if (lastIndex >= editor.children.length - 1) {
    return;
  }

  Transforms.moveNodes(editor, { at: [lastIndex + 1], to: [firstIndex] });
}
