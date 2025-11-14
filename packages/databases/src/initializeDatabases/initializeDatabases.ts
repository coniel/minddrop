import { BaseDirectory, Fs } from '@minddrop/file-system';
import { DatabasesStore } from '../DatabasesStore';
import { DatabasesConfigFileName } from '../constants';
import { Database, DatabasesConfig, SerializedDatabaseConfig } from '../types';
import { databaseConfigFilePath } from '../utils';
import { writeDatabasesConfig } from '../writeDatabasesConfig';

/**
 * Loads the user's databases into the store.
 */
export async function initializeDatabases() {
  const appConfig = await Fs.getBaseDirPath(BaseDirectory.AppConfig);
  // Path to databases config file stored in app config directory
  const databasesConfigFilePath = Fs.concatPath(
    appConfig,
    DatabasesConfigFileName,
  );

  // Ensure databases config file exists
  if (!(await Fs.exists(databasesConfigFilePath))) {
    // Create an empty databases config file if it does not exist
    await writeDatabasesConfig();

    // Config file was just created, so there are no databases to load
    return;
  }

  // Read databases config file
  const databasesConfig = await Fs.readJsonFile<DatabasesConfig>(
    databasesConfigFilePath,
  );

  // Read each database config
  const databaseConfigPromises = databasesConfig.paths.map(async ({ path }) => {
    const dbConfigFilePath = databaseConfigFilePath(path);

    try {
      const dbConfig =
        await Fs.readJsonFile<SerializedDatabaseConfig>(dbConfigFilePath);

      return {
        ...dbConfig,
        created: new Date(dbConfig.created),
        path,
      };
    } catch (error) {
      console.error(
        `Failed to read database config at path: ${dbConfigFilePath}`,
        error,
      );
      return null;
    }
  });

  const databaseConfigs = await Promise.all(databaseConfigPromises);

  // In dev mode, initializeDatabases may be called multiple times.
  // Prevent loading databases into the store more than once.
  if (DatabasesStore.getAll().length > 0) {
    return;
  }

  // Load database configs into the store
  DatabasesStore.load(
    databaseConfigs.filter((config): config is Database => config !== null),
  );
}
