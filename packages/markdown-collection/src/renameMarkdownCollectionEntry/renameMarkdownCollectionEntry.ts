import {
  CollectionEntry,
  CollectionEntryMetadata,
  CollectionEntryNotFoundError,
} from '@minddrop/collections';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { Markdown } from '@minddrop/markdown';
import { getMarkdownEntryMetadataFilePath } from '../utils';

/**
 * Renames a markdown collection entry.
 *
 * @param entry - The entry to rename.
 * @param newTitle - The new title for the entry.
 * @param metadata - The metadata for the entry.
 * @returns The updated entry.
 *
 * @throws {CollectionEntryNotFoundError} If the entry file does not exist.
 * @throws {PathConflictError} If the new file path already exists.
 */
export async function renameMarkdownCollectionEntry(
  entry: CollectionEntry,
  newTitle: string,
  metadata: CollectionEntryMetadata,
): Promise<CollectionEntry> {
  // Use the new title as the markdown file name
  const newPath = entry.path.replace(/[^/]+\.md$/, `${newTitle}.md`);

  // Ensure the entry file exists
  if (!(await Fs.exists(entry.path))) {
    throw new CollectionEntryNotFoundError(entry.path);
  }

  // Ensure the new file path does not already exist
  if (await Fs.exists(newPath)) {
    throw new PathConflictError(newPath);
  }

  // Update the markdown header
  const updatedMarkdown = Markdown.updateHeading(entry.content || '', newTitle);

  // Update the entry with the new path and title
  const updatedEntry = {
    ...entry,
    metadata,
    path: newPath,
    title: newTitle,
    content: updatedMarkdown,
  };

  // Update the new title as the metadata file name
  const newMetadataPath = getMarkdownEntryMetadataFilePath(updatedEntry);

  // Rename the entry files
  await Promise.all([
    Fs.rename(entry.path, newPath),
    Fs.rename(getMarkdownEntryMetadataFilePath(entry), newMetadataPath),
  ]);

  await Promise.all([
    // Write the updated content to the new file
    Fs.writeTextFile(
      newPath,
      Markdown.setProperties(updatedMarkdown, entry.properties),
    ),
    // Write the updated metadata to the new metadata file
    Fs.writeTextFile(newMetadataPath, JSON.stringify(metadata)),
  ]);

  // Return the updated entry
  return updatedEntry;
}
