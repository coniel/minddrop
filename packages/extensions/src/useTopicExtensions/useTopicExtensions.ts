import { Extension } from '../types';
import { useEnabledExtensions } from '../useEnabledExtensions';

/**
 * Returns the extensions enabled for a given topic.
 *
 * @param topicId - The ID of the topic for which to retrieve the extensions.
 * @returns The extensions enabled on the topic.
 */
export function useTopicExtensions(topicId: string): Extension[] {
  // Get all enabled extensions
  const extensions = useEnabledExtensions();

  // Return extensions enabled on the topic
  return extensions.filter((extension) => extension.topics.includes(topicId));
}
