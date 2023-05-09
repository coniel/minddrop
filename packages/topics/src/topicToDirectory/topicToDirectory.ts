import { Core, Fs, NotFoundError } from '@minddrop/core';
import { incrementalPath } from '@minddrop/utils';
import { getTopic } from '../getTopic';

/**
 * Converts a file based topic into a directory. If the
 * topic is already a directory, does nothing.
 *
 * @param core - A MindDrop core instance.
 * @param path - The path to the topic file.
 * @returns The new topic path.
 */
export async function topicToDirectory(
  core: Core,
  path: string,
): Promise<string> {
  // Get the topic from the store
  const topic = getTopic(path);
  // Ensure topic path exists
  const pathExists = await Fs.exists(path);

  // Ensure topic exists
  if (!topic || !pathExists) {
    throw new NotFoundError('topic', path);
  }

  // If the topic is already a directory, do nothing
  if (topic.isDir) {
    return path;
  }

  // The directory path
  const dirPath = await incrementalPath(path.slice(0, -3));
  // The markdown file name
  const filename = `${dirPath.split('/').slice(-1)[0]}.md`;

  // Create a directory with the same name as the topic
  // markdown file, minus the file extension.
  Fs.createDir(dirPath);

  // Move the topic file into the new directory
  Fs.renameFile(path, `${dirPath}/${filename}`);

  return dirPath;
}
