import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { getDatabase } from '../getDatabase';
import {
  resolveDatabaseConfigFilePath,
  resolveDatabasePath,
  serializeDatabase,
} from '../utils';

/**
 * Writes the config of the specified database to the file system.
 *
 * @param id - The ID of the database to write the config for.
 *
 * @throws {DatabaseNotFoundError} Thrown if the database does not exist.
 */
export async function writeDatabaseConfig(id: string): Promise<void> {
  // Get the database config
  const database = getDatabase(id);
  const databasePath = resolveDatabasePath(database);

  // Ensure the database's hidden .minddrop directory exists
  await Fs.ensureDir(Fs.concatPath(databasePath, Paths.hiddenDirName));

  // Write the config to the file system
  await Fs.writeJsonFile(
    resolveDatabaseConfigFilePath(databasePath),
    serializeDatabase(database),
  );
}
