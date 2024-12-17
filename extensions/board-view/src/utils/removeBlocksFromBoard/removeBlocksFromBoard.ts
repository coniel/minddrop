import { BoardView } from '../../types';
import { removeBlocksFromBoardSections } from '../removeBlocksFromBoardSections';

/**
 * Removes the specified blocks from the board view.
 *
 * @param view - The view from which to remove the blocks.
 * @param blocks - The blocks to remove.
 * @returns The updated view.
 */
export function removeBlocksFromBoard(
  view: BoardView,
  removedBlockIds: string[],
): BoardView {
  const newBlocks = view.blocks.filter(
    (blockId) =>
      !removedBlockIds.some((removedBlockId) => removedBlockId === blockId),
  );

  const newSections = removeBlocksFromBoardSections(
    view.sections,
    removedBlockIds,
  );

  return { ...view, blocks: newBlocks, sections: newSections };
}
