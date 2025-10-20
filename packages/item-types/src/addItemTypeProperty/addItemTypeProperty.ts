import { PropertySchema } from '@minddrop/properties';
import { getItemTypeConfig } from '../getItemTypeConfig';
import { ItemTypeConfig } from '../types';
import { updateItemType } from '../updateItemType';

/**
 * Adds a property to an item type.
 *
 * @param type - The item type to add the property to.
 * @param property - The property to add.
 * @returns The updated item type config.
 */
export async function addItemTypeProperty(
  type: string,
  property: PropertySchema,
): Promise<ItemTypeConfig> {
  // Get the item type config
  const config = getItemTypeConfig(type);

  // Add the property to the item type's properties
  const properties = [...config.properties, property];

  // Update the item type
  await updateItemType(type, { properties });

  // Return the updated config
  return { ...config, properties };
}
