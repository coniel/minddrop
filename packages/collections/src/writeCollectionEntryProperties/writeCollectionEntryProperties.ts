import { Fs } from '@minddrop/file-system';
import {
  CollectionConfigDirName,
  CollectionPropertiesDirName,
} from '../constants';
import { CollectionEntryProperties } from '../types';

/**
 * Writes a collection entry's properties to its properties file.
 *
 * @param collectionPath - The path to the collection directory.
 * @param entryTitle - The title of the collection entry.
 * @param properties - The properties to write.
 */
export async function writeCollectionEntryProperties(
  collectionPath: string,
  entryTitle: string,
  properties: Partial<CollectionEntryProperties>,
): Promise<void> {
  // Path to the entry properties file
  const path = Fs.concatPath(
    collectionPath,
    CollectionConfigDirName,
    CollectionPropertiesDirName,
    `${entryTitle}.json`,
  );

  // Write the properties file
  Fs.writeTextFile(path, JSON.stringify(properties, null, 2));
}
