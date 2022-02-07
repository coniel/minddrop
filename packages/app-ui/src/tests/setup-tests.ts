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
} from '@minddrop/topics';
import {
  onRun as onRunDrops,
  onDisable as onDisableDrops,
} from '@minddrop/drops';
import { topics, rootTopicIds, topicViews } from './topics.data';
import '../app.css';
import { Views } from '@minddrop/views';
import { viewInstances, views } from './views.data';

export const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

export const globalPersistentStore = { topics: rootTopicIds };
export const localPersistentStore = { sidebarWidth: 302, expandedTopics: [] };

initializeI18n();

export function setup() {
  act(() => {
    views.forEach((view) => Views.register(core, view));
    Views.loadInstances(core, [...viewInstances, ...topicViews]);
    Topics.load(core, topics);

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
  });
}
