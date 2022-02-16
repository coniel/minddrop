import { getEnabledExtensions } from '../getEnabledExtensions';

/**
 * Returns the IDs of extensions enabled for a given topic.
 *
 * @param topicId The ID of the topic for which to retrieve the extensions.
 * @returns The IDs of the extensions.
 */
export function getTopicExtensions(topicId: string): string[] {
  const enabledExtensions = getEnabledExtensions();

  return Object.values(enabledExtensions).reduce(
    (topicExtensions, extension) =>
      extension.topics.includes(topicId)
        ? [...topicExtensions, extension.id]
        : topicExtensions,
    [],
  );
}
