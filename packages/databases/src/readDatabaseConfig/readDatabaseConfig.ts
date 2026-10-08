import { Fs } from '@minddrop/file-system';
import { Database, DatabaseFileReadResult } from '../types';

/**
 * Reads a database config file.
 *
 * @param workspacePath - The absolute path to the workspace directory.
 * @param configPath - The absolute path to the database.json file.
 * @returns The database config, with its path relative to the
 *   workspace, or whether the file is missing or cannot be read.
 */
export async function readDatabaseConfig(
  workspacePath: string,
  configPath: string,
): Promise<DatabaseFileReadResult<Database>> {
  // Check the config file exists
  if (!(await Fs.exists(configPath))) {
    return { status: 'missing' };
  }

  // Config as read from the file
  let config: Database;

  try {
    // Read the config
    config = await Fs.readJsonFile<Database>(configPath);
  } catch {
    // Report a config which is not valid JSON as unreadable
    return { status: 'unreadable' };
  }

  // Resolve the database directory path, two levels above the config
  // file in the database's hidden directory.
  const databasePath = Fs.parentDirPath(Fs.parentDirPath(configPath));

  // Name the database after its directory, at its path relative to
  // the workspace.
  return {
    status: 'read',
    value: {
      // The config as stored
      ...config,
      // The directory's name
      name: Fs.fileNameFromPath(databasePath),
      // The directory's path relative to the workspace
      path: Fs.relativePath(workspacePath, databasePath),
    },
  };
}
