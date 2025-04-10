import { Events } from '@minddrop/events';
import { getBlockType } from '../BlockTypesStore';
import { BlocksStore } from '../BlocksStore';
import { generateBlocksFromDataTransfer } from '../generateBlocksFromDataTransfer';
import { Block } from '../types';

/**
 * Create blocks from a data transfer object and isnerts them into
 * the store.
 *
 * Files are written to the file system in the provided parent path.
 *
 * @param dataTransfer - The data transfer object to generate blocks from.
 * @param parentPath - The path to the parent directory in which to write files.
 * @returns The generated blocks.
 */
export async function createBlocksFromDataTransfer(
  dataTransfer: DataTransfer,
  parentPath: string,
): Promise<Block[]> {
  // Create the blocks from the data transfer object
  const blocks = await generateBlocksFromDataTransfer(dataTransfer, parentPath);

  // Insert the blocks into the store
  BlocksStore.getState().load(blocks);

  // Dispatch a block create event for each block
  blocks.forEach((block) => {
    Events.dispatch('blocks:block:create', block);

    const blockTypeConfig = getBlockType(block.type);

    if (blockTypeConfig?.onCreate) {
      blockTypeConfig.onCreate(block);
    }
  });

  return blocks;
}
