import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Topic } from '../types';
import { updateTopic } from '../updateTopic';

/**
 * Restores an archived or deleted topic and dispatches
 * a `topics:restore` event and an `topics:update` event.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic to restore.
 * @returns The restored topic.
 */
export function restoreTopic(core: Core, topicId: string): Topic {
  // Update the topic
  const updated = updateTopic(core, topicId, {
    archived: FieldValue.delete(),
    archivedAt: FieldValue.delete(),
    deleted: FieldValue.delete(),
    deletedAt: FieldValue.delete(),
  });

  // Dispatch 'topics:restore' event
  core.dispatch('topics:restore', updated);

  return updated;
}
