import { FileEntry } from '@minddrop/core';
import { Topic } from '../types';

/**
 * Recursively transforms an array of file entries
 * into a topic tree.
 *
 * @param fileEntries - The file entries to transform.
 * @param parentDir - The parent directory name.
 */
export function fileEntriesToTopics(
  fileEntries: FileEntry[],
  parentDir?: string,
): Record<string, Topic> {
  const topics: Record<string, Topic> = {};

  fileEntries.forEach((fileEntry) => {
    if (
      // Is a file
      !fileEntry.children &&
      // Is a markdown file
      fileEntry.name?.endsWith('.md') &&
      // Is not the parent topic's markdown file
      fileEntry.name !== `${parentDir}.md`
    ) {
      const filename = fileEntry.name as string;
      const title = filename.slice(0, -3);

      // Add the topic to the tree
      topics[filename] = {
        filename,
        title,
        isDir: false,
        subtopics: {},
      };
    }

    if (
      // Is a directory
      fileEntry.children &&
      fileEntry.name
    ) {
      // Add the topic to the tree
      topics[fileEntry.name] = {
        filename: fileEntry.name,
        title: fileEntry.name,
        isDir: true,
        // Transform child file entries into subtopics
        subtopics: fileEntriesToTopics(fileEntry.children, fileEntry.name),
      };
    }
  });

  return topics;
}
