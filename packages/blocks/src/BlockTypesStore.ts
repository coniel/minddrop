import { createArrayStore } from '@minddrop/utils';
import { BlockType } from './types';

export const BlockTypesStore = createArrayStore<BlockType>('id');

/**
 * Registers a BlockType.
 *
 * @param type - The block type to register.
 */
export function registerBlockType(type: BlockType): void {
  BlockTypesStore.remove(type.id);
  BlockTypesStore.add(type);
}

/**
 * Unregisters a BlockType by file type.
 *
 * @param id - The ID of the type to unregister.
 */
export function unregisterBlockType(id: string): void {
  BlockTypesStore.remove(id);
}

/**
 * Retrieves a BlockType by ID or null if it doesn't exist.
 *
 * @param id - The ID of the type to retrieve.
 * @returns The type or null if it doesn't exist.
 */
export function getBlockType(id: string): BlockType | null {
  const type = BlockTypesStore.get(id);

  return type || null;
}

/**
 * Retrieves a BlockType by ID or null if it doesn't exist.
 *
 * @param id - The ID of the type to retrieve.
 * @returns The type or null if it doesn't exist.
 */
export const useBlockType = (id: string): BlockType | null => {
  return BlockTypesStore.useAllItems().find((type) => type.id === id) || null;
};

/**
 * Retrieves all BlockTypes.
 *
 * @returns And array of all registered BlockTypes.
 */
export const useBlockTypes = (): BlockType[] => {
  return BlockTypesStore.useAllItems();
};
