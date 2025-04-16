import { CollectionEntry } from '@minddrop/collections';
import { Fs } from '@minddrop/file-system';
import { Markdown } from '@minddrop/markdown';
import { getMarkdownEntryMetadataFilePath } from '../utils';

/**
 * Updates a markdown collection entry by writing the new content and metadata
 * to the appropriate files.
 *
 * If the entry files do not exist, they will be created.
 *
 * @param entry - The updated collection entry.
 * @returns A the updated collection entry.
 */
export async function updateMarkdownCollectionEntry(
  entry: CollectionEntry,
): Promise<CollectionEntry> {
  // Generate the new content for the markdown file
  const newContent = Markdown.setProperties(
    entry.content || '',
    entry.properties,
  );

  await Promise.all([
    // Write the new content to the markdown file
    Fs.writeTextFile(entry.path, newContent),
    // Write the new metadata to the metadata file
    Fs.writeTextFile(
      getMarkdownEntryMetadataFilePath(entry),
      JSON.stringify(entry.metadata),
    ),
  ]);

  // Return the updated entry
  return entry;
}
