import { Fs, NotFoundError } from '@minddrop/core';
import { getTopic } from '../getTopic';

/**
 * Ensures that a topic exists as both a file and
 * in the topics store. Throws if either does not
 * exist.
 *
 * @param path - The path to the topic file.
 */
export async function ensureTopicExists(path: string): Promise<void> {
  // Ensure that the topic file exists
  const exists = await Fs.exists(path);

  if (!exists) {
    throw new NotFoundError('topic file', path);
  }

  // Ensure that the topic exists in the store
  if (!getTopic(path)) {
    throw new NotFoundError('topic', path);
  }
}
