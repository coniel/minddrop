import { TopicsStore } from '../TopicsStore';
import { Topic } from '../types';

/**
 * Returns a topic by path.
 *
 * @param path - The topic path.
 * @returns The requested topic or `null` if it does not exist.
 */
export function getTopic(path: string): Topic | null {
  const { topics } = TopicsStore.getState();

  return topics.find((topic) => topic.path === path) || null;
}
