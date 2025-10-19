import { PropertiesDirPath } from '../constants';

/**
 * Generates the file path for the properties file of an item.
 *
 * @param path - The item's path.
 *
 * @returns The file path for the item's properties file.
 */
export function generateItemPropertiesFilePath(path: string): string {
  const entryFileNameWithoutExt = path
    .split('/')
    .pop()!
    .split('.')
    .slice(0, -1)
    .join('.');

  const itemParentPath = path.split('/').slice(0, -1).join('/');

  return `${itemParentPath}/${PropertiesDirPath}/${entryFileNameWithoutExt}.yaml`;
}
