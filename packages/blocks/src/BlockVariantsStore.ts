import { createArrayStore } from '@minddrop/utils';
import { Block, BlockVariant } from './types';
import { BlockTypesStore } from './BlockTypesStore';

export const BlockVariantsStore = createArrayStore<BlockVariant<any>>('id');

/**
 * Registers a BlockVariant.
 *
 * @param variant - The variant to register.
 */
export function registerBlockVariant<TBlock extends Block = Block>(
  variant: BlockVariant<TBlock>,
): void {
  BlockVariantsStore.add(variant);
}

/**
 * Unregisters a BlockVariant by file type.
 *
 * @param id - The ID of the variant to unregister.
 */
export function unregisterBlockVariant(id: string): void {
  BlockVariantsStore.remove(id);
}

/**
 * Retrieves a BlockVariant by ID or null if it doesn't exist.
 *
 * @param id - The ID of the variant to retrieve.
 * @returns The variant or null if it doesn't exist.
 */
export function getBlockVariant(id: string): BlockVariant | null {
  const variant = BlockVariantsStore.get(id);

  return variant || null;
}

export const useBlockVariant = (blockType: string, variantId?: string) => {
  const allVariants = BlockVariantsStore.useAllItems();
  const blockTypeConfig = BlockTypesStore.get(blockType);
  const defaultVariant = allVariants.find(
    (variant) =>
      variant.blockType === blockType &&
      variant.id === blockTypeConfig?.defaultVariant,
  );

  if (!variantId) {
    return defaultVariant;
  }

  const variant = allVariants.find(
    (variant) => variant.blockType === blockType && variant.id === variantId,
  );

  return variant || defaultVariant;
};
