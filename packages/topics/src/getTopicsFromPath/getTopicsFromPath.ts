import { Fs } from '@minddrop/core';
import { fileEntriesToTopics } from '../fileEntriesToTopics';
import { Topic } from '../types';

/**
 * Recersively reads files from the provided path and
 * transforms them into topics.
 *
 * @param path - The root path from which to read.
 * @param recursive - When `true`, recursively traverses the directories looking for subtopics.
 */
export async function getTopicsFromPath(
  path: string,
  recursive = true,
): Promise<Topic[]> {
  // Recursively fetch files from the target directory
  const files = await Fs.readDir(path, { recursive });

  // Transform file entries to topics
  return fileEntriesToTopics(files);
}
