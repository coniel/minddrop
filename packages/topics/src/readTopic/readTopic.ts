import { FileNotFoundError, Fs } from '@minddrop/core';
import { topicTitleFromPath } from '../topicTitleFromPath';

/**
 * Returns the text content of the topic at the given path,
 * or null if the topic is a directory with no associated text
 * file.
 *
 * @param path - The topic's absolute path.
 * @reurns The topic file's text content or null if the topic has no file.
 *
 * @throws FileNoFoundError
 * Thrown if the topic file/dir does not exist.
 */
export async function readTopic(path: string): Promise<string | null> {
  // Ensure that the path exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // If the path points to a markdown file, return
  // its contents.
  if (path.endsWith('.md')) {
    return await Fs.readTextFile(path);
  }

  // Generate a path to the directory topic's associated
  // markdown file.
  const mdPath = `${path}/${topicTitleFromPath(path)}.md`;

  // If the markdown file exists, return its contents
  if (await Fs.exists(mdPath)) {
    return await Fs.readTextFile(mdPath);
  }

  // Topic is a directory with no associated text file
  return null;
}
