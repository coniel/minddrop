import { EntityGroupTypeConfig } from '@minddrop/entity-groups';
import { entityIdType } from '@minddrop/utils';

/**
 * Filters entity IDs down to those a group of the type can hold.
 *
 * @param itemIds - The IDs of the entities to filter.
 * @param config - The config of the group type.
 * @returns The IDs of the entities the type accepts.
 */
export function resolveAcceptedEntityGroupItems(
  itemIds: string[],
  config: EntityGroupTypeConfig,
): string[] {
  return itemIds.filter((itemId) =>
    config.itemTypes.includes(entityIdType(itemId) ?? ''),
  );
}
