import { BoardView } from '../types';

/**
 * Removes the specified blocks from the board view.
 *
 * @param view - The view from which to remove the blocks.
 * @param blocks - The blocks to remove.
 * @param updateView - Callback to update the view.
 */
export function removeBlocksFromBoard(
  view: BoardView,
  removedBlockIds: string[],
): BoardView {
  const newBlocks = view.blocks.filter(
    (blockId) =>
      !removedBlockIds.some((removedBlockId) => removedBlockId === blockId),
  );

  const newSections = view.sections.map((section) => {
    // Remove the blocks from 'columns' section's columns
    if (section.type === 'columns') {
      return {
        ...section,
        columns: section.columns.map((column) => ({
          ...column,
          blocks: column.blocks.filter(
            (blockId) =>
              !removedBlockIds.some(
                (removedBlockId) => removedBlockId === blockId,
              ),
          ),
        })),
      };
    }

    // Remove the blocks from 'list' and 'grid' sections
    return {
      ...section,
      blocks: section.blocks.filter(
        (blockId) =>
          !removedBlockIds.some((removedBlockId) => removedBlockId === blockId),
      ),
    };
  });

  return { ...view, blocks: newBlocks, sections: newSections };
}
