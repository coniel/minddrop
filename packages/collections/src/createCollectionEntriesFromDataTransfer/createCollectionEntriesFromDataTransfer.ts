import { createCollectionEntryFromFile } from '../createCollectionEntryFromFile';
import { createCollectionEntryFromString } from '../createCollectionEntryFromString';
import { CollectionEntry } from '../types';

/**
 * Creates collection entries from the provided data transfer object.
 *
 * It processes both files and text contained in the data transfer,
 * creating appropriate collection entries for each.
 *
 * @param data - The data transfer object containing files and/or text.
 * @returns A promise that resolves to an array of created collection entries.
 */
export async function createCollectionEntriesFromDataTransfer(
  data: DataTransfer,
): Promise<CollectionEntry[]> {
  const entries: Promise<CollectionEntry | null>[] = [];

  // If the data transfer contains files, create collection entries from them
  if (data.files.length > 0) {
    for (const file of Array.from(data.files)) {
      entries.push(createCollectionEntryFromFile(file));
    }
  }

  // If the data transfer contains text, create collection entries from it
  if (data.types.includes('text/plain')) {
    const text = data.getData('text/plain');

    entries.push(createCollectionEntryFromString(text));
  }

  return Promise.all(entries).then((results) =>
    results.filter((entry): entry is CollectionEntry => entry !== null),
  );
}
