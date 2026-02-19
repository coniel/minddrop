import { i18n } from '@minddrop/i18n';
import { PropertyFilesDirNameKey } from '../../constants';
import { getDatabase } from '../../getDatabase';
import { getDatabaseEntry } from '../../getDatabaseEntry';

/**
 * Returns the path to an entry property's file.
 *
 * @param entryId - The ID of the entry.
 * @param propertyName - The name of the property.
 * @param fileName - The name of the file, i.e. the value of the property.
 * @returns The path to the property file.
 */
export function getPropertyFilePath(
  entryId: string,
  propertyName: string,
  fileName: string,
): string {
  // Get the entry
  const entry = getDatabaseEntry(entryId);

  // Get the entry's database
  const database = getDatabase(entry.database);

  switch (database.propertyFileStorage) {
    case 'common':
      const commonDirName =
        database.propertyFilesDir || i18n.t(PropertyFilesDirNameKey);
      return `${database.path}/${commonDirName}/${fileName}`;
    case 'property':
      return `${database.path}/${propertyName}/${fileName}`;
    case 'entry':
      return `${database.path}/${entry.title}/${fileName}`;
    case 'root':
    default:
      return `${database.path}/${fileName}`;
  }
}
