import { Core } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import { getExtension } from '../getExtension';
import { useExtensionsStore } from '../useExtensionsStore';

/**
 * Enables an extension on topics and dispatches a
 * `extensions:enable-topics` event.
 *
 * @param core A MindDrop core instance.
 * @param extensionId The ID of the extension to enable.
 * @param topicsIds The IDs of the topics for which to enable the extension.
 */
export function enableExtensionOnTopics(
  core: Core,
  extensionId: string,
  topicsIds: string[],
): void {
  // Get the extension
  const extension = getExtension(extensionId);
  // Get the topics
  const topics = Topics.get(topicsIds);

  // Add the topics to the extension's topic list
  const updated = {
    ...extension,
    topics: [...extension.topics, ...topicsIds],
  };

  // Update the extension in the store
  useExtensionsStore.getState().setExtension(updated);

  // Call the extension's onEnableTopics callback
  if (extension.onEnableTopics) {
    extension.onEnableTopics(core, topics);
  }

  // Dispatch a 'extensions:enable-topics' event
  core.dispatch('extensions:enable-topics', {
    extension: updated,
    topics,
  });
}
