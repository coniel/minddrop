import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { InvalidParameterError } from '@minddrop/utils';
import { PropertyFilesDirNameKey } from '../constants';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';

/**
 * Ensures that the directory into which an entry property's file
 * would be written exists, based on the database's property file
 * storage configuration.
 *
 * @param entryId - The ID of the entry.
 * @param propertyName - The name of the property.
 *
 * @throws {InvalidParameterError} If the database uses entry based storage and the entry directory does not exist.
 */
export async function ensurePropertyFileDirExists(
  entryId: string,
  propertyName: string,
): Promise<void> {
  // Get the entry
  const entry = getDatabaseEntry(entryId);
  // Get the database
  const database = getDatabase(entry.database);

  // If the database uses property based storage, ensure the property
  // subdirectory exists.
  if (database.propertyFileStorage === 'property') {
    const propertyDirPath = Fs.concatPath(database.path, propertyName);

    if (!(await Fs.exists(propertyDirPath))) {
      await Fs.createDir(propertyDirPath);
    }
  }

  // If the databases uses common storage, ensure the common subdirectory
  // exists.
  if (database.propertyFileStorage === 'common') {
    const commonDirName =
      database.propertyFilesDir || i18n.t(PropertyFilesDirNameKey);
    const commonDirPath = Fs.concatPath(database.path, commonDirName);

    if (!(await Fs.exists(commonDirPath))) {
      await Fs.createDir(commonDirPath);
    }
  }

  // If the databases uses entry based storage, ensure the entry
  // subdirectory exists.
  if (database.propertyFileStorage === 'entry') {
    if (!(await Fs.exists(Fs.parentDirPath(entry.path)))) {
      throw new InvalidParameterError(
        `Entry directory does not exist: ${entry.path}`,
      );
    }
  }
}
