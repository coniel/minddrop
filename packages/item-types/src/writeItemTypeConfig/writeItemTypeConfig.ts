import { BaseDirectory, Fs } from '@minddrop/file-system';
import { ItemTypeConfigsDir } from '../constants';
import { getItemTypeConfig } from '../getItemTypeConfig';

/**
 * Writes the item type config for the specified type to the file system.
 *
 * @param type - The item type's type.
 */
export async function writeItemTypeConfig(type: string): Promise<void> {
  // Get the item type config
  const config = getItemTypeConfig(type);

  // Write the config to the file system
  Fs.writeJsonFile(`${ItemTypeConfigsDir}/${type}.json`, config, true, {
    baseDir: BaseDirectory.WorkspaceConfig,
  });
}
