import { BoardSection } from '../../types';
import { removeBlocksFromBoardSections } from '../removeBlocksFromBoardSections';

/**
 * Moves the specified blocks within the board view.
 *
 * @param sections - The board view's sections.
 * @param sectionIndex - The index of the section to which the blocks are being moved.
 * @param blockIds - The IDs of the blocks to move.
 * @param dropIndex - The index at which to insert the blocks.
 * @param columnIndex - The index of the column in which to insert the blocks. Only required if the target section is a 'columns' section.
 */
export function moveBlocksWithinBoard(
  sections: BoardSection[],
  sectionIndex: number,
  blockIds: string[],
  dropIndex: number,
  columnIndex?: number,
): BoardSection[] {
  // Get the section into which the blocks were dropped
  const targetSection = sections[sectionIndex];
  // Get the current blocks from the target section
  const targetSectionBlocks = getSectionBlocks(targetSection, columnIndex);

  // Get  the adjusted drop index, accounting for blocks above
  // the drop index which are being moved.
  const adjustedDropIndex = getAdjustedDropIndex(
    targetSectionBlocks,
    blockIds,
    dropIndex,
  );

  // Remove the moved blocks from their original positions
  const updatedSections = removeBlocksFromBoardSections(sections, blockIds);
  // Get the target section's updated blocks list
  const updatedTargetSection = { ...updatedSections[sectionIndex] };
  const updatedTargetSectionBlocks = getSectionBlocks(
    updatedTargetSection,
    columnIndex,
  );

  // Insert the moved blocks at the adjusted drop index
  const newBlocks = [...updatedTargetSectionBlocks];
  newBlocks.splice(adjustedDropIndex, 0, ...blockIds);

  // Update the target section with the new blocks
  updatedSections.splice(
    sectionIndex,
    1,
    setSectionBlocks(updatedTargetSection, newBlocks, columnIndex),
  );

  return updatedSections;
}

function getAdjustedDropIndex(
  preMoveBlockIds: string[],
  movedBlockIds: string[],
  dropIndex: number,
): number {
  let index = dropIndex;

  // If the drop index has moved blocks above it, adjust the index
  // to account for the moved blocks.
  for (const movedBlockId of movedBlockIds) {
    const movedBlockIndex = preMoveBlockIds.indexOf(movedBlockId);

    if (movedBlockIndex > -1 && movedBlockIndex < dropIndex) {
      index -= 1;
    }
  }

  return index;
}

function getSectionBlocks(
  section: BoardSection,
  columnIndex?: number,
): string[] {
  return section.type === 'columns'
    ? section.columns[columnIndex as number].blocks
    : section.blocks;
}

function setSectionBlocks(
  section: BoardSection,
  blocks: string[],
  columnIndex?: number,
): BoardSection {
  if (section.type === 'columns') {
    return {
      ...section,
      columns: section.columns.map((column, i) =>
        i === columnIndex ? { ...column, blocks: blocks } : column,
      ),
    };
  }

  return {
    ...section,
    blocks: blocks,
  };
}
