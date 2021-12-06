import { Core, DataInsert } from '@minddrop/core';
import { getTopic } from '../getTopic';

/**
 * Dispatches a `topics:insert-data` event for a given topic.
 *
 * @param core A MindDrop core instance.
 * @param topicId The topic into which the data is being inserted.
 */
export function insertData(
  core: Core,
  topicId: string,
  data: DataInsert,
): void {
  const topic = getTopic(topicId);

  // Dispatch 'topics:insert-data' event
  core.dispatch('topics:insert-data', { topic, data });
}
