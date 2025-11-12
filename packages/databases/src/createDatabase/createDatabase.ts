import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseAlreadyExistsError } from '../errors';
import { getDataType } from '../getDataType';
import { Database } from '../types';
import { writeDatabaseConfig } from '../writeDatabaseConfig';
import { writeDatabasesConfig } from '../writeDatabasesConfig';

export type CreateDatabaseOptions = Omit<
  Database,
  'properties' | 'created' | 'path'
>;

/**
 * Creates a new database with the specified options.
 *
 * @param parentDirPath - The path to the parent directory where the database directory will be created.
 * @param options - The database creation options.
 * @returns The new database.
 *
 * @dispatches databases:database:create
 */
export async function createDatabase(
  parentDirPath: string,
  options: CreateDatabaseOptions,
): Promise<Database> {
  // Get the data type config. This will throw an error if the data type does not exist.
  const dataType = getDataType(options.dataType);

  // The path to the database directory
  const dbPath = Fs.concatPath(parentDirPath, options.name);

  // Ensure the database does not already exist
  if (DatabasesStore.get(options.name)) {
    throw new DatabaseAlreadyExistsError(options.name);
  }

  // Ensure the database directory does not already exist
  if (await Fs.exists(dbPath)) {
    throw new PathConflictError(dbPath);
  }

  // Generate the database config
  const databaseConfig: Database = {
    ...options,
    path: dbPath,
    created: new Date(),
    properties: dataType.properties,
  };

  // Add the database to the store
  DatabasesStore.add(databaseConfig);

  // Create the database directory at the specified path
  await Fs.createDir(dbPath);

  // Write the database config to the file system
  await writeDatabaseConfig(options.name);

  // Add the database path to the user's databases config file
  await writeDatabasesConfig();

  // Dispatch database created event
  Events.dispatch('databases:database:create', databaseConfig);

  return databaseConfig;
}
