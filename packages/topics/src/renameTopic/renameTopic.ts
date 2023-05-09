import { Core, Fs } from '@minddrop/core';
import { incrementalPath } from '@minddrop/utils';
import { Markdown } from '@minddrop/markdown';
import { ensureTopicExists } from '../ensureTopicExists';
import { getTopic } from '../getTopic';
import { topicTitleFromPath } from '../topicTitleFromPath';
import { Topic } from '../types';
import { TopicsStore } from '../TopicsStore';

/**
 * Renames a topic markdown file (as well as directory
 * if the topic is a directory), and updates the
 * markdown heading (if present) to match.
 *
 * Uses incremental file naming to avoid collisions.
 *
 * @param core - A MindDrop core instance.
 * @param path - The topic path.
 * @param name - The new topic name/title.
 * @returns The new topic path.
 */
export async function renameTopic(
  core: Core,
  path: string,
  name: string,
): Promise<string> {
  // The topic's markdown file path
  let markdownFilePath = path;
  // The topic's new drectory path after being renamed
  let newDirPath = '';
  // The topic's new markdown file path
  let newMarkdownFilePath = '';
  // The topic's new name/title, possibly with a
  // numeric suffix to avoid filename collisions.
  let suffixedName = name;

  // Ensure that the topic exists
  ensureTopicExists(path);

  // Get the topic
  const topic = getTopic(path) as Topic;

  // Remove current topic name from the topic's path
  let pathParts = path.split('/').slice(0, -1);

  if (topic.isDir) {
    // Add new topic name as the topic directory name
    pathParts.push(name);

    // Generate the new directory path name with incremental suffix
    newDirPath = await incrementalPath(pathParts.join('/'));

    // Get the topic name from the new directory path in case a
    // suffix was added to it.
    suffixedName = topicTitleFromPath(newDirPath);

    // Rename the topic directory
    Fs.renameFile(path, newDirPath);

    // Update `pathParts` to include new directory name
    pathParts = newDirPath.split('/');
    // The markdown file's new path inside the renamed
    // topic directory.
    markdownFilePath = `${newDirPath}/${topicTitleFromPath(path)}.md`;
  }

  // Add new filename to the path
  pathParts.push(`${suffixedName}.md`);

  // Generate the new path name with incremental suffix
  newMarkdownFilePath = await incrementalPath(pathParts.join('/'));

  // Get the topic name from the new filename in case
  // a suffix was added to it.
  suffixedName = topicTitleFromPath(newMarkdownFilePath);

  // Rename the topic file
  await Fs.renameFile(markdownFilePath, newMarkdownFilePath);

  // Update topic markdown title
  Markdown.updateFileHeading(newMarkdownFilePath, suffixedName);

  // The new topic path
  const newPath = topic.isDir ? newDirPath : newMarkdownFilePath;

  // Update topic in store
  TopicsStore.getState().update(path, { path: newPath, title: suffixedName });

  // Dispatch a 'topics:topic:event' event
  core.dispatch('topics:topic:upate', {
    before: topic,
    after: {
      ...topic,
      path: newPath,
      title: suffixedName,
    },
  });

  // Return topic dir/file path
  return newPath;
}
