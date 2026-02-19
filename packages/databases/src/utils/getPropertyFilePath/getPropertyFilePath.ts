import { getDatabase } from '../../getDatabase';
import { getDatabaseEntry } from '../../getDatabaseEntry';

/**
 * Returns the path to a property file for the specified entry and property.
 *
 * @param entryId - The ID of the entry.
 * @param propertyName - The name of the property.
 * @returns The path to the property file or null if the property does not have
 * a value.
 */
export function getPropertyFilePath(
  entryId: string,
  propertyName: string,
): string | null {
  // Get the entry
  const entry = getDatabaseEntry(entryId);
  // Get the property value
  const propertyValue = entry.properties[propertyName];

  if (!propertyValue) {
    return null;
  }

  // Get the entry's database
  const database = getDatabase(entry.database);

  switch (database.propertyFileStorage) {
    case 'root':
      return `${database.path}/${propertyValue}`;
    case 'common':
      return `${database.path}/${database.propertyFilesDir}/${propertyValue}`;
    case 'property':
      return `${database.path}/${propertyName}/${propertyValue}`;
    case 'entry':
      return `${database.path}/${entry.title}/${propertyValue}`;
  }
}
