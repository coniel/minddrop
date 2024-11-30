import { Block } from '@minddrop/extension';
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
  blocks: Block[],
): BoardView {
  const newBlocks = view.blocks.filter(
    (blockId) => !blocks.some((block) => block.id === blockId),
  );

  const newSections = view.sections.map((section) => {
    // Remove the blocks from 'columns' section's columns
    if (section.type === 'columns') {
      return {
        ...section,
        columns: section.columns.map((column) => ({
          ...column,
          blocks: column.blocks.filter(
            (blockId) => !blocks.some((block) => block.id === blockId),
          ),
        })),
      };
    }

    // Remove the blocks from 'list' and 'grid' sections
    return {
      ...section,
      blocks: section.blocks.filter(
        (blockId) => !blocks.some((block) => block.id === blockId),
      ),
    };
  });

  return { ...view, blocks: newBlocks, sections: newSections };
}
