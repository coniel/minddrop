import { Fs } from '@minddrop/file-system';
import {
  FileExtensionToPropertyType,
  FilePropertySchema,
  PropertySchema,
} from '@minddrop/properties';
import { getDatabase } from '../../getDatabase';

/**
 * Returns the default property for the specified database which supports
 * the specified file type.
 *
 * Property match priority:
 * - Specific default property for the file type
 * - Generic default file property
 * - First available specific property which supports the file type
 * - First available generic file property
 *
 * @param databaseId - The ID of the database.
 * @param fileName - The name of the file.
 * @returns The default property for the specified database and file name or null if no matching property exists.
 */
export function getDefaultFileProperty(
  databaseId: string,
  fileName: string,
): PropertySchema | null {
  // Get the database
  const database = getDatabase(databaseId);

  // Get the property type which supports the file
  const propertyType =
    FileExtensionToPropertyType[Fs.getFileExtension(fileName)];

  // Check if a default property is provided for this property type
  let propertyName = database.defaultProperties?.[propertyType];

  // If a specific default property for this file type is not provided,
  // check if a default generic file property is provided.
  if (!propertyName) {
    propertyName = database.defaultProperties?.[FilePropertySchema.type];
  }

  // Get the default property if there is one
  let property = propertyName
    ? database.properties.find((property) => property.name === propertyName)
    : undefined;

  // If a default property for this file type is not provided or does
  // not exist, exist, use the first available property matching the
  // supported property type.
  if (!propertyName || !property) {
    property = database.properties.find(
      (property) => property.type === propertyType,
    );
  }

  // If a property explicitly supporting the file type does not exist,
  // look for a generic file property.
  if (!property) {
    // Check if a default generic file property is specified
    propertyName = database.defaultProperties?.[FilePropertySchema.type];
    property = propertyName
      ? database.properties.find((property) => property.name === propertyName)
      : undefined;

    // If no default generic file property exists, use the first use the
    // first available generic file property.
    if (!propertyName || !property) {
      property = database.properties.find(
        (property) => property.type === FilePropertySchema.type,
      );
    }
  }

  return property || null;
}
