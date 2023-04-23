import { Core } from '@minddrop/core';
import { getTopicsFromPath } from '../getTopicsFromPath';
import { TopicsStore } from '../TopicsStore';

/**
 * Reads topics from a directory and loads them
 * into the topics store. Dispatches a 'topics:load'
 * event.
 *
 * @param core - A MindDrop core instance.
 * @param path - The path from which to load the topics.
 */
export async function loadTopics(core: Core, path: string): Promise<void> {
  // Fetch topics from path
  const topics = await getTopicsFromPath(path);

  // Load the topics into the store
  TopicsStore.getState().load(topics);

  // Dispatch a 'topics:load' event
  core.dispatch('topics:load', topics);
}
