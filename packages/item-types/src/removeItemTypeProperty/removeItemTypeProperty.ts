import { getItemTypeConfig } from '../getItemTypeConfig';
import { ItemTypeConfig } from '../types';
import { updateItemType } from '../updateItemType';

/**
 * Removes a property from an item type.
 *
 * @param type - The item type to remove the property from.
 * @param propertyName - The name of the property to remove.
 * @returns The updated item type config.
 */
export async function removeItemTypeProperty(
  type: string,
  propertyName: string,
): Promise<ItemTypeConfig> {
  // Get the item type config
  const config = getItemTypeConfig(type);

  // Remove the property from the item type's properties
  const properties = config.properties.filter(
    (property) => property.name !== propertyName,
  );

  // Update the item type
  updateItemType(type, { properties });

  // Return the updated config
  return {
    ...config,
    properties,
  };
}
