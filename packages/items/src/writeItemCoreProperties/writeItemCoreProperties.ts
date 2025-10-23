import { Fs } from '@minddrop/file-system';
import { Properties } from '@minddrop/properties';
import { getItem } from '../getItem';
import { itemCoreProperties, itemCorePropertiesFilePath } from '../utils';

/**
 * Writes an item's core properties to its properties file.
 *
 * @param path - The item's path.
 * @param properties - The properties to write.
 */
export async function writeItemCoreProperties(path: string): Promise<void> {
  // Path to the item properties file
  const propertiesFilePath = itemCorePropertiesFilePath(path);
  // Get the item
  const item = getItem(path);

  // Write the properties file
  Fs.writeTextFile(
    propertiesFilePath,
    Properties.stringify(itemCoreProperties(item)),
  );
}
