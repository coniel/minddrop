import { initializeCore } from '@minddrop/core';
import { initializeI18n } from '@minddrop/i18n';
import { PersistentStore } from '@minddrop/persistent-store';
import { onRun as onRunApp } from '@minddrop/app';
import { onRun as onRunTags } from '@minddrop/tags';
import { onRun as onRunFiles } from '@minddrop/files';
import {
  onRun as onRunTopics,
  Topics,
  TOPICS_TEST_DATA,
} from '@minddrop/topics';
import { Drops, onRun as onRunDrops } from '@minddrop/drops';
import { Views, VIEWS_TEST_DATA } from '@minddrop/views';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import '../app.css';

const { viewInstances, views } = VIEWS_TEST_DATA;
const { dropTypeConfigs, drops } = DROPS_TEST_DATA;
const {
  views: viewsTopics,
  topics,
  rootTopicIds,
  topicViewInstances,
  tCoastalNavigationView,
} = TOPICS_TEST_DATA;

export const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

export const globalPersistentStore = { topics: rootTopicIds };
export const localPersistentStore = {
  sidebarWidth: 302,
  expandedTopics: [],
  view: 'topics:columns-view',
  viewInstance: tCoastalNavigationView.id,
};

initializeI18n();

PersistentStore.setGlobalStore(core, globalPersistentStore);
PersistentStore.setLocalStore(core, localPersistentStore);

[...views, ...viewsTopics].forEach((view) => Views.register(core, view));
dropTypeConfigs.forEach((config) => Drops.register(core, config));
Views.loadInstances(core, [...viewInstances, ...topicViewInstances]);
Drops.load(core, drops);
Topics.load(core, topics);

onRunApp(core);
onRunFiles(core);
onRunTags(core);
onRunDrops(core);
onRunTopics(core);
