import { i18n } from '@minddrop/i18n';
import { Properties } from '@minddrop/properties';
import { PropertyFilesDirNameKey } from '../../constants';
import { Database } from '../../types';

/**
 * Returns the paths of the shared directories that hold a database's
 * property files.
 *
 * Only `common` and `property` file storage use dedicated shared
 * directories; `root` storage keeps property files loose in the database
 * root and `entry` storage keeps them in per-entry subdirectories, so both
 * return an empty array.
 *
 * @param database - The database whose property directories to resolve.
 * @returns The property directory paths.
 */
export function resolveDatabasePropertyDirs(database: Database): string[] {
  switch (database.propertyFileStorage) {
    // A single shared directory holds all property files
    case 'common': {
      const dirName =
        database.propertyFilesDir || i18n.t(PropertyFilesDirNameKey);

      return [`${database.path}/${dirName}`];
    }
    // One directory per file-based property, named after the property
    case 'property':
      return database.properties
        .filter(Properties.isFileBased)
        .map((property) => `${database.path}/${property.name}`);
    // Root and entry storage have no dedicated shared property directories
    default:
      return [];
  }
}
