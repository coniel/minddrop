import { BLOCKS_DATA_KEY } from '../constants';
import { Block } from '../types';
import { serializeBlocksToDataTransferData } from '../utils';

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

  // Serialize all the blocks to data transfer data format
  const data = serializeBlocksToDataTransferData(existingBlocks.concat(blocks));

  // Update the data transfer data
  Object.entries(data).forEach(([key, value]) => {
    dataTransfer.setData(key, value);
  });
}
