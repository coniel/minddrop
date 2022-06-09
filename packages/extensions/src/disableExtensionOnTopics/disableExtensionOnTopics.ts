import { Core } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import { FieldValue } from '@minddrop/utils';
import { getExtension } from '../getExtension';
import { ExtensionsResource } from '../ExtensionsResource';

/**
 * Disables an extension on topics.
 * Dispatches a `extensions:extension:disable-topics` event.
 *
 * @param core - A MindDrop core instance.
 * @param extensionId - The ID of the extension to disable.
 * @param topicIds - The ID of the topics for which to disable the extension.
 */
export function disableExtensionOnTopics(
  core: Core,
  extensionId: string,
  topicIds: string[],
): void {
  // Get the extension
  let extension = getExtension(extensionId);
  // Get the topics
  const topics = Topics.get(topicIds);

  // Update the extension document
  ExtensionsResource.update(core, extension.document, {
    // Remove the given topics
    topics: FieldValue.arrayRemove(topicIds),
  });

  // Get the updated extension
  extension = getExtension(extensionId);

  if (extension.onDisableTopics) {
    // Call the extension's onDisableTopics callback
    extension.onDisableTopics(core, topics);
  }

  // Dispatch a 'extensions:extension:disable-topics' event
  core.dispatch('extensions:extension:disable-topics', {
    extension,
    topics,
  });
}
