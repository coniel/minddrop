import { entityIdType } from '@minddrop/utils';
import { UnsupportedEntityGroupItemError } from '../errors';
import { EntityGroupTypeConfig } from '../types';

/**
 * Validates that an item is of a type the group type accepts.
 *
 * @param itemId - The ID of the item to validate.
 * @param config - The config of the group's type.
 *
 * @throws {UnsupportedEntityGroupItemError} If the item is not of a type the group can hold.
 */
export function validateEntityGroupItem(
  itemId: string,
  config: EntityGroupTypeConfig,
): void {
  if (!config.itemTypes.includes(entityIdType(itemId) ?? '')) {
    throw new UnsupportedEntityGroupItemError(itemId);
  }
}
