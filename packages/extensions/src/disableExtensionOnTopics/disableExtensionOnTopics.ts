import { Core } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import { getExtension } from '../getExtension';
import { useExtensionsStore } from '../useExtensionsStore';

/**
 * Disables an extension on topics and dispatches a
 * `extensions:disable-topics` event.
 *
 * @param core A MindDrop core instance.
 * @param extensionId The ID of the extension to disable.
 * @param topicIds The ID of the topics for which to disable the extension.
 */
export function disableExtensionOnTopics(
  core: Core,
  extensionId: string,
  topicIds: string[],
): void {
  // Get the extension
  const extension = getExtension(extensionId);
  // Get the topics
  const topics = Topics.get(topicIds);

  // Remove the topics from the extension's topics list
  const updated = {
    ...extension,
    topics: extension.topics.filter((topicId) => !topicIds.includes(topicId)),
  };

  // Update the topic in the store
  useExtensionsStore.getState().setExtension(updated);

  // Call the extension's onDisableTopics callback
  if (extension.onDisableTopics) {
    extension.onDisableTopics(core, topics);
  }

  // Dispatch a 'extensions:disable-topics' event
  core.dispatch('extensions:disable-topics', {
    extension: updated,
    topics,
  });
}
