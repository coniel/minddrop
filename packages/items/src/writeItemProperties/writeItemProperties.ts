import { Fs } from '@minddrop/file-system';
import { Properties, PropertiesSchema } from '@minddrop/properties';
import { ItemProperties } from '../types';
import { generateItemPropertiesFilePath } from '../utils';

/**
 * Writes an item's properties to its properties file.
 *
 * @param path - The item's path.
 * @param properties - The properties to write.
 */
export async function writeItemProperties(
  path: string,
  properties: ItemProperties,
  schema: PropertiesSchema,
): Promise<void> {
  // Path to the item properties file
  const propertiesFilePath = generateItemPropertiesFilePath(path);

  // Write the properties file
  Fs.writeTextFile(
    propertiesFilePath,
    Properties.stringify(properties, schema),
  );
}
