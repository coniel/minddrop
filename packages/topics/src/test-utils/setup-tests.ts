import { initializeCore } from '@minddrop/core';
import { TopicsStore } from '../TopicsStore';
import { topics } from './topics.data';

export const core = initializeCore({ extensionId: 'minddrop:topics' });

export function setup() {
  // Load test topics into the store
  TopicsStore.getState().load(topics);
}

export function cleanup() {
  // Clear the topics store
  TopicsStore.getState().clear();
}
