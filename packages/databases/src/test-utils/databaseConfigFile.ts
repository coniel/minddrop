import { MockFileDescriptor } from '@minddrop/file-system';
import { Database } from '../types';
import { resolveDatabaseConfigFilePath, serializeDatabase } from '../utils';
import { databaseDirPath } from './fixtures/databases.fixtures';

/**
 * Returns a database's config file, as written by the app.
 *
 * @param database - The database whose config file to return.
 * @returns The config file's path and contents.
 */
export function databaseConfigFile(database: Database): MockFileDescriptor {
  // Serialize the database into its config file
  return {
    path: resolveDatabaseConfigFilePath(databaseDirPath(database)),
    textContent: JSON.stringify(serializeDatabase(database), null, 2),
  };
}
