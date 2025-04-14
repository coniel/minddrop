import { CollectionEntry } from '@minddrop/collections';
import { Fs } from '@minddrop/file-system';
import { Markdown } from '@minddrop/markdown';
import { MarkdownCollectionMetadataDir } from '../../constants';

/**
 * Returns all entries in the markdown collection at the given path.
 *
 * @returns An array of collection entries.
 */
export async function getAllMarkdownCollectionEntries(
  collectionPath: string,
): Promise<CollectionEntry[]> {
  // Get markdown files from the collection directory
  const collectionFiles = await Fs.readDir(collectionPath);
  const markdownFiles = collectionFiles.filter((file) =>
    file.path.endsWith('.md'),
  );

  // Map the markdown files to collection entries
  const entries: (CollectionEntry | null)[] = await Promise.all(
    markdownFiles.map(async (file) => {
      if (!file.name) {
        return null;
      }

      try {
        const title = Fs.removeExtension(file.name);
        const content = await Fs.readTextFile(file.path);
        let metadata = {};

        // Metdata files are expected to exist and therefor we don't check
        // for existence before attempting to read them. However, we don't
        // want to throw an error if the metadata file doesn't exist, so
        // we catch the error and ignore it.
        try {
          const metadataFileContent = await Fs.readTextFile(
            Fs.concatPath(
              collectionPath,
              MarkdownCollectionMetadataDir,
              `${title}.json`,
            ),
          );

          metadata = JSON.parse(metadataFileContent);
        } catch (e) {
          // Ignore errors reading metadata
        }

        // Parse properties and markdown content from the file content
        const properties = Markdown.getProperties(content);
        const markdown = Markdown.getContent(content);

        // Return the collection entry
        return {
          title: title,
          path: file.name,
          collectionPath,
          properties,
          metadata,
          markdown,
        };
      } catch (e) {
        // Ignore errors reading files and return null to ignore the entry
        return null;
      }
    }),
  );

  return entries.filter(isCollectionEntry);
}

function isCollectionEntry(
  entry: CollectionEntry | null,
): entry is CollectionEntry {
  return entry !== null;
}
