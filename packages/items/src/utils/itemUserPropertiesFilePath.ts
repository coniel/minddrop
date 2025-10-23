import { PropertiesDirName, PropertiesDirPath } from '../constants';

/**
 * Generates the file path for an item's user properties file.
 *
 * @param path - The item's path.
 *
 * @returns The file path for the item's user properties file.
 */
export function itemUserPropertiesFilePath(path: string): string {
  const entryFileNameWithoutExt = path
    .split('/')
    .pop()!
    .split('.')
    .slice(0, -1)
    .join('.');

  const itemParentPath = path.split('/').slice(0, -1).join('/');

  return `${itemParentPath}/${PropertiesDirName}/${entryFileNameWithoutExt}.md`;
}
