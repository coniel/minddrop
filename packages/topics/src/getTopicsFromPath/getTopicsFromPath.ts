import { Fs } from '@minddrop/core';
import { fileEntriesToTopics } from '../fileEntriesToTopics';
import { Topic } from '../types';

/**
 * Recersively reads files from the provided path and
 * transforms them into a topics tree.
 *
 * @param path - The root path from which to read.
 */
export async function getTopicsFromPath(
  path: string,
): Promise<Record<string, Topic>> {
  // Recursively fetch files from the target directory
  const files = await Fs.readDir(path, { recursive: true });

  // Transform file entries to topics tree
  return fileEntriesToTopics(files);
}
