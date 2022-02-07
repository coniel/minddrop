import { initializeCore } from '@minddrop/core';
import { initializeI18n } from '@minddrop/i18n';
import { PersistentStore } from '@minddrop/persistent-store';
// import { onRun as onRunApp } from '@minddrop/app';
// import { onRun as onRunTags } from '@minddrop/tags';
// import { onRun as onRunFiles } from '@minddrop/files';
import { onRun as onRunTopics, Topics } from '@minddrop/topics';
// import { onRun as onRunDrops } from '@minddrop/drops';
import { topics, rootTopicIds, topicViews } from './topics.data';
import '../minddrop.css';
import { Views } from '@minddrop/views';
import { viewInstances, views } from './views.data';

export const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

export const globalPersistentStore = { topics: rootTopicIds };
export const localPersistentStore = { sidebarWidth: 302, expandedTopics: [] };

initializeI18n();

views.forEach((view) => Views.register(core, view));
Views.loadInstances(core, [...viewInstances, ...topicViews]);
Topics.load(core, topics);

PersistentStore.setGlobalStore(core, globalPersistentStore);
PersistentStore.setLocalStore(core, localPersistentStore);

// onRunApp(core);
// onRunFiles(core);
// onRunTags(core);
// onRunTopics(core);
// onRunDrops(core);
