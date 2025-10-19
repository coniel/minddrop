import { Fs, InvalidPathError } from '@minddrop/file-system';
import { getItemTypeInstance } from '../ItemTypeInstancesStore';
import { ConfigDirName, InstanceConfigFileName } from '../constants';
import { ItemTypeInstanceNotFoundError } from '../errors';

/**
 * Writes the relevant values from the current item type instance state
 * to its config file.
 *
 * @param id - The item type instance ID.
 *
 * @throws {InvalidParameterError} - instance does not exist.
 * @throws {InvalidPathError} - instance dir does not exist.
 */
export async function writeItemTypeInstance(id: string): Promise<void> {
  // Get the instance from the store
  const instance = getItemTypeInstance(id);

  // Ensure instance exists
  if (!instance) {
    throw new ItemTypeInstanceNotFoundError(id);
  }

  // Ensure instance dir exists
  if (!(await Fs.exists(instance.path))) {
    throw new InvalidPathError(instance.path);
  }

  // Get only relevant values from store instance
  const { path: p, ...config } = instance;

  // Generate instance config's dir path
  const configDirPath = Fs.concatPath(instance.path, ConfigDirName);

  // Create hidden instance config's dir if it doesn't exist
  if (!(await Fs.exists(configDirPath))) {
    await Fs.createDir(configDirPath);
  }

  // Generate instance config's file path
  const configFilePath = Fs.concatPath(configDirPath, InstanceConfigFileName);

  // Write values to instance config file
  Fs.writeTextFile(configFilePath, JSON.stringify(config));
}
