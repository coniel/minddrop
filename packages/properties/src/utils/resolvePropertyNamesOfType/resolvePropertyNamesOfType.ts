import { PropertiesSchema, PropertyType } from '../../types';

/**
 * Returns the names of a schema's properties of a type, or of any of
 * several types.
 *
 * @param schema - The properties schema.
 * @param type - The property type, or types, to look for.
 * @returns The names of the properties of that type.
 */
export function resolvePropertyNamesOfType(
  schema: PropertiesSchema,
  type: PropertyType | Iterable<PropertyType>,
): string[] {
  // Collect the types to look for
  const types = new Set<PropertyType>(typeof type === 'string' ? [type] : type);

  // Filter for the properties of the types and take their names
  return schema
    .filter((property) => types.has(property.type))
    .map((property) => property.name);
}
