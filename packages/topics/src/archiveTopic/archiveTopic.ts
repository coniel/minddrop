import { Core } from '@minddrop/core';
import { Topic } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Archives a topic and dispatches a `topics:archive`
 * event and an `topics:update` event.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic to archive.
 * @returns The archived topic.
 */
export function archiveTopic(core: Core, topicId: string): Topic {
  // Update the topic
  const updated = updateTopic(core, topicId, {
    archived: true,
    archivedAt: new Date(),
  });

  // Dispatch 'topics:archive' event
  core.dispatch('topics:archive', updated);

  return updated;
}
