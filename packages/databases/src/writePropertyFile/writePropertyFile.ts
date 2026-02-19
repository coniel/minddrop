import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { InvalidParameterError } from '@minddrop/utils';
import { PropertyFilesDirNameKey } from '../constants';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { updateDatabaseEntry } from '../updateDatabaseEntry';
import { updateDatabaseEntryProperty } from '../updateDatabaseEntryProperty';
import { getIncrmentalPropertyFilePath } from '../utils';

/**
 * Writes an entry property's file to the correct location based on the
 * database's property file storage configuration. Ensures that the file
 * path does not conflict with an existing file and creates any necessary
 * subdirectories.
 *
 * Optionally updates the entry's property value after writing.
 *
 * @param entryId - The ID of the entry.
 * @param propertyName - The name of the property.
 * @param file - The file to write.
 * @param updateEntry - Whether to set the file as the property's value after writing.
 * @returns The path to the written file.
 */
export async function writePropertyFile(
  entryId: string,
  propertyName: string,
  file: File,
  updateEntry = true,
): Promise<string> {
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
  // entry subdirectory exists.
  if (database.propertyFileStorage === 'entry') {
    if (!(await Fs.exists(Fs.parentDirPath(entry.path)))) {
      throw new InvalidParameterError(
        `Entry directory does not exist: ${entry.path}`,
      );
    }
  }

  // Get the path to which to write the file
  const { path, name } = await getIncrmentalPropertyFilePath(
    entry.id,
    propertyName,
    file.name,
  );

  // Write the file
  await Fs.writeBinaryFile(path, file);

  if (updateEntry) {
    // Update the entry's property value
    await updateDatabaseEntryProperty(entry.id, propertyName, name);
  }

  return path;
}
