import { DataView } from '@minddrop/data-views';
import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { getDatabase } from '../getDatabase';
import { resolveDatabasePath, resolveDatabaseViewFilePath } from '../utils';

/**
 * Deletes a database-owned view's file from the database's views
 * directory.
 *
 * @param view - The view whose file to delete.
 *
 * @throws {InvalidParameterError} If the view has no owner.
 * @throws {DatabaseNotFoundError} If the owning database does not exist.
 */
export async function removeDatabaseViewFile(view: DataView): Promise<void> {
  // Views without an owner are not database views
  if (!view.owner) {
    throw new InvalidParameterError(
      `Cannot remove the view file of view '${view.id}' without an owner`,
    );
  }

  // Get the owning database
  const database = getDatabase(view.owner);

  // Path to the view's file
  const filePath = resolveDatabaseViewFilePath(
    resolveDatabasePath(database),
    view.id,
  );

  // Delete the view file if it exists
  if (await Fs.exists(filePath)) {
    await Fs.removeFile(filePath);
  }
}
