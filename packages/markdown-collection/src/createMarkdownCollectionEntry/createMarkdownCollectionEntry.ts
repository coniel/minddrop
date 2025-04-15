import {
  CollectionEntry,
  CollectionEntryMetadata,
  CollectionEntryProperties,
} from '@minddrop/collections';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { Markdown } from '@minddrop/markdown';
import { MarkdownCollectionMetadataDir } from '../../constants';

/**
 * Creates a new markdown collection entry.
 *
 * @param collectionPath - The path to the collection directory.
 * @param defaultProperties - The default properties for the entry.
 * @param metadata - The metadata for the entry.
 * @returns The new markdown collection entry.
 */
export async function createMarkdownCollectionEntry(
  collectionPath: string,
  defaultProperties: CollectionEntryProperties,
  metadata: CollectionEntryMetadata,
): Promise<CollectionEntry> {
  // Use 'Untitled' as the default title
  let title = i18n.t('labels.untitled');
  // Absolute path of the markdown file
  let path = Fs.concatPath(collectionPath, `${title}.md`);

  // Ensure that the markdown file name does not conflict with existing files
  const { increment } = await Fs.incrementalPath(path);

  // Update the title and path if there is a conflict
  if (increment) {
    title = `${title} ${increment}`;
    path = Fs.concatPath(collectionPath, `${title}.md`);
  }

  // Use the file name as the markdown heading
  let markdown = `# ${title}`;

  // Add default properties as frontmatter
  const fileContents = Markdown.setProperties(markdown, defaultProperties);

  // Write the markdown file into the collection directory
  await Fs.writeTextFile(path, fileContents);

  // Write the metadata file into the collection metadata directory
  await Fs.writeTextFile(
    Fs.concatPath(
      collectionPath,
      MarkdownCollectionMetadataDir,
      `${title}.json`,
    ),
    JSON.stringify(metadata),
  );

  // Return the entry
  return {
    title,
    path,
    collectionPath,
    metadata,
    properties: defaultProperties,
    content: markdown,
  };
}
