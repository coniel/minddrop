import { restoreDates } from '@minddrop/utils';
import { BlockParseError } from '../errors';
import { Block, CustomBlockData, DeserializedBlockData } from '../types';

/**
 * Parses a serialized block and returns a block object.
 *
 * @param blockData - The blocks data in deserilized or string serialized form.
 * @returns The parsed block object.
 *
 * @throws {BlockParseError} When the serialized block is invalid.
 */
export function parseBlock<TData extends CustomBlockData = CustomBlockData>(
  blockData: string | DeserializedBlockData<TData>,
): Block<TData> {
  // If the block data is already deserialized, we can skip the parsing
  // and simply restore the dates.
  if (typeof blockData !== 'string') {
    return restoreDates<Block<TData>>(blockData);
  }

  try {
    // Attempt to parse the block data
    const deserializedBlockData: DeserializedBlockData = JSON.parse(blockData);

    // Restore the dates in the block data
    return restoreDates<Block<TData>>(deserializedBlockData);
  } catch (error) {
    console.error(error);
    throw new BlockParseError(blockData);
  }
}
