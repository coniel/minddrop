import { FileEntry } from '@minddrop/core';
import { Topic } from '../types';

function getSubtopicPaths(children: FileEntry[], parentName: string): string[] {
  return children
    .filter(
      (fileEntry) =>
        // Subtopics are either directories or markdown files
        (fileEntry.children || fileEntry.path.endsWith('.md')) &&
        // Don't include parent topic markdown file as child
        fileEntry.name !== `${parentName}.md`,
    )
    .map((fileEntry) => fileEntry.path);
}

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
): Topic[] {
  let topics: Topic[] = [];

  fileEntries.forEach((fileEntry) => {
    if (
      // Is a file
      !fileEntry.children &&
      // Is a markdown file
      fileEntry.name?.endsWith('.md') &&
      // Is not the parent topic's markdown file
      fileEntry.name !== `${parentDir}.md`
    ) {
      const title = fileEntry.name.slice(0, -3);

      // Add topic to array
      topics.push({
        title,
        path: fileEntry.path,
        isDir: false,
        subtopics: [],
      });
    }

    if (
      // Is a directory
      fileEntry.children &&
      fileEntry.name &&
      !fileEntry.name.startsWith('.')
    ) {
      // Add topic to array
      topics.push({
        title: fileEntry.name,
        path: fileEntry.path,
        isDir: true,
        // Transform child file entries into subtopics
        subtopics: getSubtopicPaths(fileEntry.children, fileEntry.name),
      });

      // Recursively add subtopics to array
      topics = [
        ...topics,
        ...fileEntriesToTopics(fileEntry.children, fileEntry.name),
      ];
    }
  });

  return topics;
}
