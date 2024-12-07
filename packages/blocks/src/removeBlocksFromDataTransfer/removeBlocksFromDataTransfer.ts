import { BLOCKS_DATA_KEY } from '../constants';
import { getBlocksFromDataTransfer } from '../getBlocksFromDataTransfer';

/**
 * Removes the blocks with the given IDs from the data transfer.
 *
 * @param dataTransfer - The data transfer object to remove the blocks from.
 * @param blockIds - The IDs of the blocks to remove.
 */
export function removeBlocksFromDataTransfer(
  dataTransfer: DataTransfer,
  blockIds: string[],
): void {
  // Get the blocks from the data transfer.
  const blocks = getBlocksFromDataTransfer(dataTransfer);

  // If there are no blocks, there is nothing to remove
  if (!blocks.length) {
    return;
  }

  // Filter out the blocks to remove
  const newBlocks = blocks.filter((block) => !blockIds.includes(block.id));

  if (newBlocks.length) {
    // If there are blocks left, update the data transfer
    dataTransfer.setData(BLOCKS_DATA_KEY, JSON.stringify(newBlocks));
  } else {
    // If there are no blocks left, remove the data type
    dataTransfer.clearData(BLOCKS_DATA_KEY);
  }
}
