import { initializeCore } from '@minddrop/core';
import { PersistentStore } from '@minddrop/persistent-store';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { Views } from '@minddrop/views';
import { registerViews } from '../initializeApp';

const { rootTopicIds } = TOPICS_TEST_DATA;

export const globalPersistentStore = { rootTopics: rootTopicIds };
export const localPersistentStore = { sidebarWidth: 300, expandedTopics: [] };

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

export function setup() {
  // Register default views
  registerViews();

  // Load persistent store data
  PersistentStore.setGlobalStore(core, globalPersistentStore);
  PersistentStore.setLocalStore(core, localPersistentStore);
}

export function cleanup() {
  cleanupRender();
  // Clear persistent store data
  PersistentStore.clearGlobalCache();
  PersistentStore.clearLocalCache();

  // Clear views store
  Views.clear(core);
}
