import React from 'react';
import { initializeCore } from '@minddrop/core';
import { PersistentStore } from '@minddrop/persistent-store';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { ViewConfig, Views } from '@minddrop/views';

const { rootTopicIds } = TOPICS_TEST_DATA;

export const globalPersistentStore = { rootTopics: rootTopicIds };
export const localPersistentStore = { sidebarWidth: 300, expandedTopics: [] };

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

export const homeViewConfig: ViewConfig = {
  id: 'app:home',
  type: 'static',
  component: () => <div>Home view</div>,
};

export function setup() {
  // Load persistent store data
  PersistentStore.setGlobalStore(core, globalPersistentStore);
  PersistentStore.setLocalStore(core, localPersistentStore);

  // Regsiter a default view
  Views.register(core, homeViewConfig);
}

export function cleanup() {
  cleanupRender();
  // Clear persistent store data
  PersistentStore.clearGlobalCache();
  PersistentStore.clearLocalCache();

  // Clear views store
  Views.clear(core);
}
