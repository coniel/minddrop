import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { getDatabase } from '../getDatabase';
import { databaseConfigFilePath } from '../utils';

/**
 * Writes the config of the specified database to the file system.
 *
 * @param name - The database name.
 *
 * @throws {DatabaseNotFoundError} Thrown if the database does not exist.
 */
export async function writeDatabaseConfig(name: string): Promise<void> {
  // Get the database config
  const config = { ...getDatabase(name) };

  // Remove the path before serialization
  const path = config.path;
  delete config.path;

  // Ensure the database's hidden .minddrop directory exists
  const hiddenDirPath = Fs.concatPath(path, Paths.hiddenDirName);

  if (!(await Fs.exists(hiddenDirPath))) {
    await Fs.createDir(hiddenDirPath);
  }

  // Write the config to the file system
  Fs.writeJsonFile(databaseConfigFilePath(path), config);
}
