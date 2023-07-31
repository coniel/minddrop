import { NotFoundError } from '@minddrop/core';
import { TopicsStore } from '../TopicsStore';
import { getTopic } from '../getTopic';
import { Topic } from '../types';
import { Events } from '@minddrop/events';

/**
 * Updates a topic in the topic's store and dispatches a
 * 'topics:topic:update' event.
 *
 * @param path - The topic path.
 * @param data - The data to st on the topic.
 * @returns The updated topic.
 *
 * @throws NotFoundError
 * Thrown if the topic does not exist.
 */
export function updateTopic(path: string, data: Partial<Topic>): Topic {
  // Get the topic
  const topic = getTopic(path);

  // Throw if the topic does not exist
  if (!topic) {
    throw new NotFoundError('topic', path);
  }

  // Update the topic is the store
  TopicsStore.getState().update(path, data);

  // Get the updated topic
  const updated = getTopic(path) as Topic;

  // Dispatch a 'topics:topic:update' event
  Events.dispatch('topics:topic:update', updated);

  return updated;
}
