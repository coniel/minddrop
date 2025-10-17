import { createFileCollectionEntry } from '../createFileCollectionEntry';
import { getAllCollections } from '../getAllCollections';
import { getCollectionTypeConfig } from '../getCollectionTypeConfig';
import { CollectionEntry } from '../types';

/**
 * Creates a collection entry from a file by matching it to
 * an appropriate file based collection.
 *
 * If multiple collections match the file type, the first one found
 * will be used.
 *
 * @param file - The file to create a collection entry from.
 * @returns The created collection entry, or null if no matching
 *   collection was found.
 */
export async function createCollectionEntryFromFile(
  file: File,
): Promise<CollectionEntry | null> {
  const fileExtension = file.name.split('.').pop() || '';

  // Get all file based collections which match the file type or
  // have no specific file extensions defined.
  const collections = getAllCollections().filter((collection) => {
    const config = getCollectionTypeConfig(collection.type);

    return (
      config &&
      config.type === 'file' &&
      (!config.fileExtensions || config.fileExtensions.includes(fileExtension))
    );
  });

  // If any matching collections were found, create a collection entry
  // from the first one.
  if (collections.length > 0) {
    const collection = collections[0];

    return createFileCollectionEntry(collection.path, file);
  }

  return null;
}
