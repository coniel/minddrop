import { PropertiesDirPath } from '../constants';

/**
 * Generates the file path for an item's core properties file.
 *
 * @param path - The item's path.
 *
 * @returns The file path for the item's core properties file.
 */
export function itemCorePropertiesFilePath(path: string): string {
  const entryFileNameWithoutExt = path
    .split('/')
    .pop()!
    .split('.')
    .slice(0, -1)
    .join('.');

  const itemParentPath = path.split('/').slice(0, -1).join('/');

  return `${itemParentPath}/${PropertiesDirPath}/${entryFileNameWithoutExt}.yaml`;
}
