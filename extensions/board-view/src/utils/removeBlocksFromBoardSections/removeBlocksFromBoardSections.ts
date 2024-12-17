import { BoardSection } from '../../types';

/**
 * Removes the specified blocks from the board view's sections.
 *
 * @param sections - The view sections for which to update the sections.
 * @param blocks - The blocks to remove.
 * @returns The updated sections.
 */
export function removeBlocksFromBoardSections(
  sections: BoardSection[],
  removedBlockIds: string[],
): BoardSection[] {
  const newSections = sections.map((section) => {
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

  return newSections;
}
