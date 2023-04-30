import { TopicsStore as useTopicsStore } from '../TopicsStore';
import { Topic } from '../types';

/**
 * Returns a topic or subtopic by path.
 *
 * @param path - The topic/subtopic path.
 * @returns The requested topic or `null` if it does not exist.
 */
export function useTopic(path: string): Topic | null {
  // Get topics
  const { topics } = useTopicsStore();

  return topics.find((topic) => topic.path === path) || null;
}
