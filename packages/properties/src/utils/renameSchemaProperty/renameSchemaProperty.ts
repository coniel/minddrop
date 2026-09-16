import { PropertiesSchema } from '../../types';

/**
 * Renames a property in a properties schema, keeping it in its
 * original position.
 *
 * @param schema - The properties schema.
 * @param oldName - The name of the property to rename.
 * @param newName - The new property name.
 * @returns The schema with the property renamed.
 */
export function renameSchemaProperty(
  schema: PropertiesSchema,
  oldName: string,
  newName: string,
): PropertiesSchema {
  return schema.map((property) =>
    property.name === oldName ? { ...property, name: newName } : property,
  );
}
