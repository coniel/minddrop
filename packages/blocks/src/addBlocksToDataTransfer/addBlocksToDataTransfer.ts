import { BLOCKS_DATA_KEY } from '../constants';
import { Block, BlockTemplate } from '../types';

/**
 * Adds blocks to a DataTransfer object.
 *
 * @param dataTransfer  - The DataTransfer object to add the blocks to.
 * @param blocks - The blocks to add.
 */
export function addBlocksToDataTransfer(
  dataTransfer: DataTransfer | null,
  blocks: Block[],
): void {
  let existingBlocks = [];

  if (!dataTransfer) {
    return;
  }

  // If there are already blocks in the data transfer,
  // parse them so we can append the new blocks.
  if (dataTransfer.getData(BLOCKS_DATA_KEY)) {
    existingBlocks = JSON.parse(dataTransfer.getData(BLOCKS_DATA_KEY));
  }

  // Append the new blocks to the existing ones
  dataTransfer.setData(
    BLOCKS_DATA_KEY,
    JSON.stringify(existingBlocks.concat(blocks)),
  );
}
