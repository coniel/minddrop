import { initializeCore } from '@minddrop/core';
import {
  LocalPersistentStore,
  GlobalPersistentStore,
} from '@minddrop/persistent-store';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { Views } from '@minddrop/views';
import { initializeApp, registerViews } from '../initializeApp';

const { rootTopicIds } = TOPICS_TEST_DATA;

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

export function setup() {
  // initializeApp();

  // Register default views
  registerViews();

  // Load persistent store data
  GlobalPersistentStore.set(core, 'rootTopics', rootTopicIds);
}

export function cleanup() {
  cleanupRender();
  // Clear persistent store data
  GlobalPersistentStore.store.clear();
  LocalPersistentStore.store.clear();

  // Clear views store
  Views.clear(core);
}
