import { BLOCKS_DATA_KEY } from '../constants';
import { parseBlock } from '../parseBlock';
import { Block, DeserializedBlockData } from '../types';

/**
 * Returns an array of blocks from the data transfer object.
 *
 * @param dataTransfer - The data transfer object to get the blocks from.
 * @returns An array of blocks.
 */
export function getBlocksFromDataTransfer(dataTransfer: DataTransfer): Block[] {
  // Get the blocks data from the data transfer object
  const blocksData = dataTransfer.getData(BLOCKS_DATA_KEY);

  if (!blocksData) {
    return [];
  }

  // Parse the blocks data into an array of blocks
  return JSON.parse(blocksData).map((block: DeserializedBlockData) =>
    parseBlock(block),
  );
}
