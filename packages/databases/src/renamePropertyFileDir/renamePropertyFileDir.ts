import { Fs } from '@minddrop/file-system';
import { Properties, PropertySchema } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { getDatabase } from '../getDatabase';
import { resolveDatabasePath } from '../utils';

/**
 * Renames the directory holding a file based property's files under
 * property file storage. Does nothing under the other storage modes,
 * which name no directory after the property.
 *
 * @param databaseId - The ID of the database the property belongs to.
 * @param oldProperty - The property as the schema declared it before the rename.
 * @param newName - The new property name.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {InvalidParameterError} If the property is not a file based property.
 */
export async function renamePropertyFileDir(
  databaseId: string,
  oldProperty: PropertySchema,
  newName: string,
): Promise<void> {
  // Ensure the property is file based
  if (!Properties.isFileBased(oldProperty)) {
    throw new InvalidParameterError(
      `Property ${oldProperty.name} is not a file based property.`,
    );
  }

  const database = getDatabase(databaseId);

  // Check the property's files live in a directory of their own
  if (database.propertyFileStorage !== 'property') {
    return;
  }

  // Resolve the property's current directory path
  const databasePath = resolveDatabasePath(database);
  const oldPath = Fs.concatPath(databasePath, oldProperty.name);

  // Check the directory exists
  if (!(await Fs.exists(oldPath))) {
    return;
  }

  // Rename the directory to the new property name
  await Fs.rename(oldPath, Fs.concatPath(databasePath, newName));
}
