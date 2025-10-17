import { Fs } from '@minddrop/file-system';
import { parseDateOrNow } from '@minddrop/utils';
import { CollectionPropertiesDirPath } from '../constants';
import { getCollection } from '../getCollection';
import { getCollectionTypeConfig } from '../getCollectionTypeConfig';
import { FileCollectionEntry, FileCollectionTypeConfig } from '../types';

/**
 * Reads and returns all file collection entries from the specified
 * collection path.
 *
 * @param path - The collection path.
 *
 * @returns The collection entries.
 *
 * @throws {CollectionNotFoundError} If the collection does not exist.
 * @throws {CollectionTypeNotRegisteredError} If the collection type is not
 * registered.
 */
export async function readAllFileCollectionEntries(
  path: string,
): Promise<FileCollectionEntry[]> {
  // Get the collection
  const collection = getCollection(path, true);
  // Get the collection type config
  const config = getCollectionTypeConfig<FileCollectionTypeConfig>(
    collection.type,
  );

  // Retrieve entry files from the collection
  const collectionFiles = await Fs.readDir(path);

  const entries: (FileCollectionEntry | null)[] = await Promise.all(
    collectionFiles.map(async (entryFile) => {
      const fileExtension = entryFile.name?.split('.').pop() || '';

      // Ignore files without names or with unsupported file extensions
      if (
        !entryFile.name ||
        (config.fileExtensions &&
          !config.fileExtensions.includes(fileExtension))
      ) {
        return null;
      }

      // Read the entry's properties file content
      const serializedProperties = await Fs.readTextFile(
        Fs.concatPath(
          path,
          CollectionPropertiesDirPath,
          `${Fs.removeExtension(entryFile.name)}.json`,
        ),
      );

      // Parse the entry's properties
      const properties = JSON.parse(serializedProperties);

      // Generate and return the file collection entry
      return {
        path: entryFile.path,
        collectionPath: path,
        properties: {
          ...properties,
          created: parseDateOrNow(properties.created),
          lastModified: parseDateOrNow(properties.lastModified),
        },
      };
    }),
  );

  // Filter out null entries and return the rest
  return entries.filter(
    (entry): entry is FileCollectionEntry => entry !== null,
  );
}
