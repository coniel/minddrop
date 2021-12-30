import { Core } from '@minddrop/core';
import { Topic } from '../types';
import { useTopicsStore } from '../useTopicsStore';

/**
 * Loads topics into the store and dispatches a `topics:load` event.
 *
 * @param core A MindDrop core instance.
 * @param topics The topics to load.
 */
export function loadTopics(core: Core, topics: Topic[]): void {
  // Add topics to store
  useTopicsStore.getState().loadTopics(topics);

  // Dispatch 'topics:load' event
  core.dispatch('topics:load', topics);
}
