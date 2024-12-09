import { BLOCKS_DATA_KEY } from '../../constants';
import { Block } from '../../types';

/**
 * Serializes blocks to a format that can be added to a DataTransfer object.
 *
 * @param blocks - The blocks to serialize.
 * @returns The serialized data.
 */
export function serializeBlocksToDataTransferData(
  blocks: Block[],
): Record<string, string> {
  return {
    // Set blocks JSON string as the BLOCKS_DATA_KEY
    [BLOCKS_DATA_KEY]: JSON.stringify(blocks),
    // Merge block texts to text/plain
    'text/plain': blocks
      .map((block) => block.text)
      .filter(Boolean)
      .join('\n\n'),
  };
}
