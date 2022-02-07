import { Core } from '@minddrop/core';
import { Topic, Topics } from '@minddrop/topics';
import { Views } from '@minddrop/views';

/**
 * Permanently deletes a topic along with its associated views.
 *
 * @param core A MindDrop core instance.
 * @param topicId The ID of the topic to delete.
 */
export function permanentlyDeleteTopic(core: Core, topicId: string): Topic {
  // Get the topic
  const topic = Topics.get(topicId);

  // Delete the topic
  Topics.deletePermanently(core, topicId);

  // Delete all of the topic's views
  topic.views.forEach((viewInstanceId) => {
    Views.deleteInstance(core, viewInstanceId);
  });

  return topic;
}
