import { BaseDirectory, Fs } from '@minddrop/file-system';
import { DatabasesStore } from '../DatabasesStore';
import { DatabasesConfigFileName } from '../constants';

/**
 * Writes the databases config file storing the paths of all
 * databases in the store.
 */
export async function writeDatabasesConfig(): Promise<void> {
  // Databases config file is stored in app config directory
  const appConfig = await Fs.getBaseDirPath(BaseDirectory.AppConfig);
  // Path to databases config file
  const databasesConfigFilePath = Fs.concatPath(
    appConfig,
    DatabasesConfigFileName,
  );

  // Write database paths to the config file
  await Fs.writeJsonFile(
    databasesConfigFilePath,
    {
      paths: DatabasesStore.getAll().map((database) => ({
        name: database.name,
        path: database.path,
      })),
    },
    true,
  );
}
