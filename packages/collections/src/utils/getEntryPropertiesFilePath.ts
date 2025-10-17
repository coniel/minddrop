import { CollectionPropertiesDirPath } from '../constants';
import { CollectionEntry } from '../types';

/**
 * Generates the file path for the properties file of a collection entry.
 *
 * @param entry - The collection entry object.
 *
 * @returns The file path for the entry's properties file.
 */
export function getEntryPropertiesFilePath(entry: CollectionEntry): string {
  const entryFileNameWithoutExt = entry.path
    .split('/')
    .pop()!
    .split('.')
    .slice(0, -1)
    .join('.');

  return `${entry.collectionPath}/${CollectionPropertiesDirPath}/${entryFileNameWithoutExt}.json`;
}
