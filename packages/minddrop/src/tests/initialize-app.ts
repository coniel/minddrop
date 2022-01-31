import { initializeCore } from '@minddrop/core';
import { initializeI18n } from '@minddrop/i18n';
import {
  onRun as onRunPersistentStore,
  PersistentStore,
} from '@minddrop/persistent-store';
import { onRun as onRunApp } from '@minddrop/app';
import { onRun as onRunTags } from '@minddrop/tags';
import { onRun as onRunFiles } from '@minddrop/files';
import { onRun as onRunTopics, Topics } from '@minddrop/topics';
import { onRun as onRunDrops } from '@minddrop/drops';
import { topics, rootTopicIds } from './topics.data';
import '../minddrop.css';

export const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

export const globalPersistentStore = { topics: rootTopicIds };
export const localPersistentStore = { sidebarWidth: 302, expandedTopics: [] };

initializeI18n();

onRunPersistentStore(core);
onRunApp(core);
onRunFiles(core);
onRunTags(core);
onRunTopics(core);
onRunDrops(core);

Topics.load(core, topics);

PersistentStore.setGlobalStore(core, globalPersistentStore);
PersistentStore.setLocalStore(core, localPersistentStore);

export function reInitialize() {
  Topics.clear(core);
  Topics.load(core, topics);
  PersistentStore.clearGlobalCache();
  PersistentStore.clearLocalCache();
  PersistentStore.setGlobalStore(core, globalPersistentStore);
  PersistentStore.setLocalStore(core, localPersistentStore);
}
