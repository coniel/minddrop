import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { initializeI18n } from '@minddrop/i18n';
import { PersistentStore } from '@minddrop/persistent-store';
import { onRun as onRunApp, onDisable as onDisableApp } from '@minddrop/app';
import { onRun as onRunTags, onDisable as onDisableTags } from '@minddrop/tags';
import {
  onRun as onRunFiles,
  onDisable as onDisableFiles,
} from '@minddrop/files';
import {
  onRun as onRunTopics,
  onDisable as onDisableTopics,
  Topics,
  TOPICS_TEST_DATA,
} from '@minddrop/topics';
import {
  onRun as onRunDrops,
  onDisable as onDisableDrops,
  Drops,
  DROPS_TEST_DATA,
  Drop,
} from '@minddrop/drops';
import { View, Views, VIEWS_TEST_DATA } from '@minddrop/views';
import '../app.css';

const { topics, rootTopicIds, topicViewConfigs, topicViewInstances } =
  TOPICS_TEST_DATA;
const { staticView, viewInstances, viewConfigs } = VIEWS_TEST_DATA;
const { dropTypeConfigs, drops } = DROPS_TEST_DATA;

const homeView: View = {
  ...staticView,
  extension: 'app',
  id: 'app:home',
};

export const core = initializeCore({ appId: 'app-id', extensionId: 'app' });
export const viewsCore = initializeCore({
  appId: 'app-id',
  extensionId: 'views',
});
export const topicsCore = initializeCore({
  appId: 'app-id',
  extensionId: 'topics',
});

export const globalPersistentStore = { rootTopics: rootTopicIds };
export const localPersistentStore = { sidebarWidth: 302, expandedTopics: [] };

initializeI18n();

export function setup() {
  act(() => {
    Views.register(core, homeView);
    viewConfigs.forEach((view) => Views.register(viewsCore, view));
    dropTypeConfigs.forEach((config) => Drops.register<Drop>(core, config));
    Views.loadInstances(core, [...viewInstances, ...topicViewInstances]);
    topicViewConfigs.forEach((config) => {
      Topics.registerView(topicsCore, config);
    });
    Topics.load(core, topics);
    Drops.load(core, drops);

    PersistentStore.setGlobalStore(core, globalPersistentStore);
    PersistentStore.setLocalStore(core, localPersistentStore);

    onRunApp(core);
    onRunFiles(core);
    onRunTags(core);
    onRunTopics(core);
    onRunDrops(core);
  });
}

export function cleanup() {
  act(() => {
    PersistentStore.clearGlobalCache();
    PersistentStore.clearLocalCache();

    onDisableApp(core);
    onDisableTags(core);
    onDisableFiles(core);
    onDisableDrops(core);
    onDisableTopics(core);

    jest.clearAllMocks();
  });
}
