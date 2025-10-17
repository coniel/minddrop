import { Fs } from '@minddrop/file-system';
import { isSerializedDate, parseDateOrNow } from '@minddrop/utils';
import { CollectionPropertiesDirPath } from '../constants';
import { getCollection } from '../getCollection';
import { getCollectionTypeConfig } from '../getCollectionTypeConfig';
import { TextCollectionEntry, TextCollectionTypeConfig } from '../types';

/**
 * Reads and returns all text collection entries from the specified
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
export async function readAllTextCollectionEntries(
  path: string,
): Promise<TextCollectionEntry[]> {
  // Get the collection
  const collection = getCollection(path, true);
  // Get the collection type config
  const config = getCollectionTypeConfig<TextCollectionTypeConfig>(
    collection.type,
  );

  // Retrieve entry files from the collection
  const entryFiles = await Fs.readDir(path);

  // Retrieve all property files from the collection if present
  const hasPropertiesDir = await Fs.exists(
    Fs.concatPath(path, CollectionPropertiesDirPath),
  );
  const propertyFiles = hasPropertiesDir
    ? await Fs.readDir(Fs.concatPath(path, CollectionPropertiesDirPath))
    : [];

  // Read and return all text collection entries, ignoring any files which
  // don't match the collection's expected file extension.
  const entries: (TextCollectionEntry | null)[] = await Promise.all(
    entryFiles.map(async (entryFile) => {
      if (
        !entryFile.name ||
        !entryFile.path.endsWith(`.${config.fileExtension}`)
      ) {
        return null;
      }

      // Read the entry file content
      const content = await Fs.readTextFile(entryFile.path);

      // Parse the entry file content
      let properties = config.parse(content);

      // Find the corresponding properties file if it exists
      const propertiesFile = propertyFiles.find(
        (propFile) =>
          propFile.name &&
          Fs.removeExtension(propFile.name) ===
            Fs.removeExtension(entryFile.name as string),
      );

      // Read additional properties from the properties file if it exists
      if (propertiesFile) {
        const propertiesContent = await Fs.readTextFile(propertiesFile.path);
        const additionalProperties = JSON.parse(propertiesContent);

        // Merge the properties from the entry file and the properties file
        properties = {
          ...properties,
          ...additionalProperties,
        };
      }

      // Parse created and lastModified dates if they are serialized
      properties.created = isSerializedDate(properties.created)
        ? parseDateOrNow(properties.created)
        : properties.created;
      properties.lastModified = isSerializedDate(properties.lastModified)
        ? parseDateOrNow(properties.lastModified)
        : properties.lastModified;

      return {
        path: entryFile.path,
        collectionPath: collection.path,
        properties,
      } as TextCollectionEntry;
    }),
  );

  // Filter out any null entries
  const filteredEntries = entries.filter(
    (entry): entry is TextCollectionEntry => entry !== null,
  );

  return filteredEntries;
}
