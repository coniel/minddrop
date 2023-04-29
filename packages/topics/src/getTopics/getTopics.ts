import { Topic } from '../types';
import { getTopic } from '../getTopic/getTopic';

/**
 * Returns topics at the specified paths, omitting any
 * missing topics.
 *
 * @param paths - The topic paths.
 * @returns The requested topics.
 */
export function getTopics(paths: string[]): Topic[] {
  return paths
    .map((path) => getTopic(path))
    .filter((topic) => topic !== null) as Topic[];
}
