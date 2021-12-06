import { Core } from '@minddrop/core';
import { Topic } from '../types';

/**
 * Lodas topics into the store by dispatching a `topics:load` event.
 *
 * @param core A MindDrop core instance.
 * @param topics The topics to load.
 */
export function loadTopics(core: Core, topics: Topic[]): void {
  // Dispatch 'topics:load' event
  core.dispatch('topics:load', topics);
}
