import { Core } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import { FieldValue } from '@minddrop/utils';
import { getExtension } from '../getExtension';
import { ExtensionsResource } from '../ExtensionsResource';

/**
 * Enables an extension on topics.
 * Dispatches a `extensions:extension:enable-topics` event.
 *
 * @param core - A MindDrop core instance.
 * @param extensionId - The ID of the extension to enable.
 * @param topicsIds - The IDs of the topics for which to enable the extension.
 */
export function enableExtensionOnTopics(
  core: Core,
  extensionId: string,
  topicsIds: string[],
): void {
  // Get the extension
  let extension = getExtension(extensionId);
  // Get the topics
  const topics = Topics.get(topicsIds);

  // Update the extension document
  ExtensionsResource.update(core, extension.document, {
    // Add the topic IDs
    topics: FieldValue.arrayUnion(topicsIds),
  });

  // Get the updated extension
  extension = getExtension(extensionId);

  if (extension.onEnableTopics) {
    // Call the extension's onEnableTopics callback
    extension.onEnableTopics(core, topics);
  }

  // Dispatch a 'extensions:extension:enable-topics' event
  core.dispatch('extensions:extension:enable-topics', {
    extension,
    topics,
  });
}
