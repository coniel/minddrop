import { Core } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import { FieldValue } from '@minddrop/utils';
import { getExtension } from '../getExtension';
import { updateExtensionDocument } from '../updateExtensionDocument';

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
  // Get the topics
  const topics = Topics.get(topicsIds);

  // Update the extension document
  updateExtensionDocument(core, extensionId, {
    // Add the topic IDs
    topics: FieldValue.arrayUnion(topicsIds),
  });

  // Get the updated extension
  const extension = getExtension(extensionId);

  if (extension.onEnableTopics) {
    // Call the extension's onEnableTopics callback
    extension.onEnableTopics(core, topics);
  }

  // Dispatch a 'extensions:enable-topics' event
  core.dispatch('extensions:enable-topics', {
    extension,
    topics,
  });
}
