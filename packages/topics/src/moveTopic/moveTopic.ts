import { Core, Fs, InvalidParameterError, NotFoundError } from '@minddrop/core';
import { incrementalPath } from '@minddrop/utils';
import { getTopic } from '../getTopic';
import { topicToDirectory } from '../topicToDirectory';

/**
 * Moves a topic and its subtopics and contents to a
 * new path. Dispatches a 'topics:topic:move' event.
 *
 * @param core - A MindDrop core instance.
 * @param path - The path of the topic to move.
 * @param destinationPath - The path to which to move the topic.
 */
export async function moveTopic(
  core: Core,
  path: string,
  destinationPath: string,
): Promise<void> {
  // The destination path as a directory
  let destinationDirPath = destinationPath;
  // Get topic from store
  const topic = getTopic(path);

  if (!topic) {
    throw new NotFoundError('topic', path);
  }

  // Ensure topic file/directory exists
  const pathExists = await Fs.exists(path);

  if (!pathExists) {
    throw new NotFoundError('topic path', path);
  }

  // Ensure destination path exists
  const destinationPathExists = await Fs.exists(destinationPath);

  if (!destinationPathExists) {
    throw new InvalidParameterError(
      `cannot move topic: destination path "${path}" does not exist`,
    );
  }

  // If the destination path is a file based topic,
  // convert it into a directory.
  const destinationTopic = getTopic(destinationPath);

  if (destinationTopic && !destinationTopic.isDir) {
    destinationDirPath = await topicToDirectory(core, destinationPath);
  }

  // Generate the topic's new path
  const newPath = await incrementalPath(
    `${destinationDirPath}/${topic.title}${!topic.isDir ? '.md' : ''}`,
  );

  // Move topic to new path
  await Fs.renameFile(path, newPath);

  // Update topic and its subtopics in the store
  // Dispatch 'topics:topic:move' event
}
