import { CollectionEntry } from '@minddrop/collections';
import { Fs } from '@minddrop/file-system';
import { getMarkdownEntryMetadataFilePath } from '../utils';

/**
 * Moves all files associated with a markdown collection entry to the system trash.
 * If the entry files do not exist, no action is taken.
 *
 * @param entry - The collection entry to delete.
 */
export async function deleteMarkdwnCollectionEntry(
  entry: CollectionEntry,
): Promise<void> {
  const metadataFilePath = getMarkdownEntryMetadataFilePath(entry);

  return new Promise((resolve) => {
    setTimeout(async () => {
      // Move the entry markdown file to the system trash if it exists
      if (await Fs.exists(entry.path)) {
        Fs.trashFile(entry.path);
      }

      // Move the entry metadata file to the system trash if it exists
      if (await Fs.exists(metadataFilePath)) {
        Fs.trashFile(metadataFilePath);
      }

      resolve();
    }, 300);
  });
}
