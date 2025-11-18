import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { getDatabase } from '../getDatabase';
import { databaseConfigFilePath } from '../utils';

/**
 * Writes the config of the specified database to the file system.
 *
 * @param id - The ID of the database to write the config for.
 *
 * @throws {DatabaseNotFoundError} Thrown if the database does not exist.
 */
export async function writeDatabaseConfig(id: string): Promise<void> {
  // Get the database config
  const config = { ...getDatabase(id) };

  // Remove the path before serialization
  const path = config.path;
  // @ts-expect-error - Remove the path before serialization
  delete config.path;

  // Ensure the database's hidden .minddrop directory exists
  const hiddenDirPath = Fs.concatPath(path, Paths.hiddenDirName);

  if (!(await Fs.exists(hiddenDirPath))) {
    await Fs.createDir(hiddenDirPath);
  }

  // Write the config to the file system
  Fs.writeJsonFile(databaseConfigFilePath(path), config);
}
