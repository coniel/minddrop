import { BLOCK_TEMPLATES_DATA_KEY } from '../constants';
import { parseBlock } from '../parseBlock';
import { BlockTemplate, DeserializedBlockData } from '../types';

/**
 * Returns an array of block templates from the data transfer object.
 *
 * @param dataTransfer - The data transfer object to get the blocks from.
 * @returns An array of block templates.
 */
export function getBlockTemplatesFromDataTransfer(
  dataTransfer: DataTransfer,
): BlockTemplate[] {
  // Get the block templates data from the data transfer object
  const blocksData = dataTransfer.getData(BLOCK_TEMPLATES_DATA_KEY);

  if (!blocksData) {
    return [];
  }

  // Parse the data into an array of block templates
  return JSON.parse(blocksData).map((block: DeserializedBlockData) =>
    parseBlock(block),
  );
}
