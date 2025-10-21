import { Fs } from '@minddrop/file-system';
import { getItemTypeConfig } from '../getItemTypeConfig';
import { itemTypeConfigFilePath } from '../utils';

/**
 * Writes the item type config for the specified type to the file system.
 *
 * @param type - The item type's type.
 */
export async function writeItemTypeConfig(type: string): Promise<void> {
  // Get the item type config
  const config = getItemTypeConfig(type);

  // Write the config to the file system
  Fs.writeJsonFile(itemTypeConfigFilePath(type), config);
}
