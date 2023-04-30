import { TopicsStore as useTopicsStore } from '../TopicsStore';
import { Topic } from '../types';

/**
 * Returns topics by path if they exist.
 *
 * @param paths - The topic paths.
 * @returns The requested topics.
 */
export function useTopics(paths: string[]): Topic[] {
  // Get all topics
  const { topics } = useTopicsStore();

  // Return requested topics
  return topics.filter((topic) => paths.includes(topic.path));
}
