import { PropertiesSchema, PropertyType } from '../../types';

/**
 * Returns the names of a schema's properties of a type.
 *
 * @param schema - The properties schema.
 * @param type - The property type to look for.
 * @returns The names of the properties of that type.
 */
export function resolvePropertyNamesOfType(
  schema: PropertiesSchema,
  type: PropertyType,
): string[] {
  // Filter for the properties of the type and take their names
  return schema
    .filter((property) => property.type === type)
    .map((property) => property.name);
}
