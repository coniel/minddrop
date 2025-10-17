import { CollectionPropertiesDirPath } from '../constants';

/**
 * Generates the file path for the properties file of a collection entry.
 *
 * @param collectionPath - The path to the collection.
 * @param entryPath - The path to the entry file or the entry title.
 *
 * @returns The file path for the entry's properties file.
 */
export function generateEntryPropertiesFilePath(
  collectionPath: string,
  entryPath: string,
): string {
  const entryFileNameWithoutExt = entryPath
    .split('/')
    .pop()!
    .split('.')
    .slice(0, -1)
    .join('.');

  return `${collectionPath}/${CollectionPropertiesDirPath}/${entryFileNameWithoutExt}.json`;
}
