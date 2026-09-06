import { DataView, DataViews } from '@minddrop/data-views';
import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { getDatabase } from '../getDatabase';
import {
  resolveDatabaseViewFilePath,
  resolveDatabaseViewsDirPath,
} from '../utils';

/**
 * Writes a database-owned view to its file in the database's views
 * directory.
 *
 * @param view - The view to write.
 *
 * @throws {InvalidParameterError} If the view has no owner.
 * @throws {DatabaseNotFoundError} If the owning database does not exist.
 */
export async function writeDatabaseView(view: DataView): Promise<void> {
  // Views without an owner are not database views
  if (!view.owner) {
    throw new InvalidParameterError(
      `Cannot write view '${view.id}' as a database view without an owner`,
    );
  }

  // Get the owning database
  const database = getDatabase(view.owner);

  // Ensure the database's views directory exists
  await Fs.ensureDir(resolveDatabaseViewsDirPath(database.path));

  // Write the view to the file system in its stored form, without
  // the data source which is derived from the database at load time.
  await Fs.writeJsonFile(
    resolveDatabaseViewFilePath(database.path, view.id),
    DataViews.serialize(view, { dataSource: false }),
  );
}
