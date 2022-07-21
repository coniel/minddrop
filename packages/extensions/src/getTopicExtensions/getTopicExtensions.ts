import { Extension } from '../types';
import { getEnabledExtensions } from '../getEnabledExtensions';

/**
 * Returns the extensions enabled for a given topic.
 *
 * @param topicId - The ID of the topic for which to retrieve the extensions.
 * @returns An array of extensions.
 */
export function getTopicExtensions(topicId: string): Extension[] {
  const enabledExtensions = getEnabledExtensions();

  return Object.values(enabledExtensions).reduce(
    (topicExtensions, extension) =>
      extension.topics.includes(topicId)
        ? [...topicExtensions, extension]
        : topicExtensions,
    [],
  );
}
