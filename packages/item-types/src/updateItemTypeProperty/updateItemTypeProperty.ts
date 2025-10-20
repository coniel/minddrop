import { PropertySchema } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { getItemTypeConfig } from '../getItemTypeConfig';
import { ItemTypeConfig } from '../types';
import { updateItemType } from '../updateItemType/updateItemType';

/**
 * Updates a property in an item type.
 *
 * @param type - The item type to update the property in.
 * @param updatedProperty - The updated property schema.
 * @returns The updated item type config.
 */
export async function updateItemTypeProperty(
  type: string,
  updatedProperty: PropertySchema,
): Promise<ItemTypeConfig> {
  // Get the item type config
  const config = getItemTypeConfig(type);
  // Find the existing property
  const property = config.properties.find(
    (prop) => prop.name === updatedProperty.name,
  );

  // Prevent property name from being changed
  if (!property) {
    throw new InvalidParameterError(
      'Cannot update property name. Use "renameProperty" method instead.',
    );
  }

  // Prevent changing property type
  if (property.type !== updatedProperty.type) {
    throw new InvalidParameterError(
      'Cannot update property type. Use the "changePropertyType" method instead.',
    );
  }

  // Update the property in the item type's properties
  const properties = config.properties.map((prop) =>
    prop.name === updatedProperty.name ? updatedProperty : prop,
  );

  // Update the item type
  updateItemType(type, { properties });

  // Return the updated config
  return {
    ...config,
    properties,
  };
}
