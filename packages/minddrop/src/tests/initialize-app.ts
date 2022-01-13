import { initializeCore } from '@minddrop/core';
import { initializeI18n } from '@minddrop/i18n';
import {
  onRun as onRunPersistentStore,
  PersistentStore,
} from '@minddrop/persistent-store';
import { onRun as onRunTags } from '@minddrop/tags';
import { onRun as onRunFiles } from '@minddrop/files';
import { onRun as onRunTopics, Topics } from '@minddrop/topics';
import { onRun as onRunDrops } from '@minddrop/drops';
import { topics, rootTopicIds } from './topics.data';

export const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

export const globalPersistentStore = { topics: rootTopicIds };
export const localPersistentStore = { sidebarWidth: 302 };

initializeI18n();

onRunPersistentStore(core);
onRunFiles(core);
onRunTags(core);
onRunTopics(core);
onRunDrops(core);

Topics.load(core, topics);

PersistentStore.setGlobalStore(core, globalPersistentStore);
PersistentStore.setLocalStore(core, localPersistentStore);
