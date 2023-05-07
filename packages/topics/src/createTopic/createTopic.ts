import { Core, Fs, InvalidParameterError } from '@minddrop/core';
import { incrementalPath } from '@minddrop/utils';
import { TopicsStore } from '../TopicsStore';
import { Topic } from '../types';

/**
 * Creates a topic at the specified path and dispatches a
 * 'topics:topic:create' event.
 *
 * @param core - A MindDrop core instance.
 * @param path - The path at which to create the topic.
 * @param asDir - When `true`, the topic will be created as a directory.
 * @returns The created topic.
 */
export async function createTopic(
  core: Core,
  path: string,
  asDir = false,
): Promise<Topic> {
  // Path of the topic's markdown file
  let mdPath = '';
  // The topic's title
  let title = '';

  // Ensure path exists
  const pathExists = await Fs.exists(path);

  if (!pathExists) {
    throw new InvalidParameterError(
      `cannot create topic at path ${path}: path does not exist`,
    );
  }

  // Create topic directory if needed
  if (asDir) {
    const dirPath = await incrementalPath(`${path}/Untitled`);
    // Title is same as directory name
    title = dirPath.split('/').slice(-1)[0];
    // Set markdown path to inside the directory
    mdPath = `${dirPath}/${title}.md`;

    await Fs.createDir(dirPath);
  } else {
    mdPath = await incrementalPath(`${path}/Untitled.md`);
    // Title is same a filename without extension
    title = mdPath.split('/').slice(-1)[0].slice(0, -3);
  }

  // Create topic markdown file
  await Fs.writeTextFile(mdPath, `# ${title}\n\n`);

  const topic: Topic = {
    title,
    path: mdPath,
    isDir: asDir,
    subtopics: [],
  };

  // Add to topics store
  TopicsStore.getState().add(topic);

  // Dispatch a 'topics:topic:create' event
  core.dispatch('topics:topic:create', topic);

  // Return topic
  return topic;
}
