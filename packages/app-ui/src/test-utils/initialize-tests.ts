import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { initializeI18n } from '@minddrop/i18n';
import {
  GlobalPersistentStore,
  LocalPersistentStore,
} from '@minddrop/persistent-store';
import {
  App,
  onRun as onRunApp,
  onDisable as onDisableApp,
} from '@minddrop/app';
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
} from '@minddrop/drops';
import {
  ViewConfig,
  Views,
  ViewInstances,
  VIEWS_TEST_DATA,
} from '@minddrop/views';
import * as ViewsExtension from '@minddrop/views';
import '../app.css';

const { topics, rootTopicIds, topicViewConfigs, topicViewInstances } =
  TOPICS_TEST_DATA;
const { staticViewConfig, viewInstances, viewConfigs } = VIEWS_TEST_DATA;
const { dropTypeConfigs, drops } = DROPS_TEST_DATA;

const homeView: ViewConfig = {
  ...staticViewConfig,
  id: 'app:home',
};

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

initializeI18n();

export function setup() {
  Views.register(core, homeView);
  viewConfigs.forEach((view) => Views.register(core, view));
  dropTypeConfigs.forEach((config) => Drops.register(core, config));
  ViewInstances.store.load(core, [...viewInstances, ...topicViewInstances]);
  topicViewConfigs.forEach((config) => {
    Topics.registerView(core, config);
  });
  Topics.store.load(core, topics);
  Drops.store.load(core, drops);

  onRunApp(core);
  onRunFiles(core);
  onRunTags(core);
  ViewsExtension.onRun(core);
  onRunTopics(core);
  onRunDrops(core);
  App.addRootTopics(core, rootTopicIds);
}

export function cleanup() {
  act(() => {
    GlobalPersistentStore.store.clear();
    GlobalPersistentStore.typeConfigsStore.clear();
    LocalPersistentStore.store.clear();
    LocalPersistentStore.typeConfigsStore.clear();

    onDisableApp(core);
    onDisableTags(core);
    onDisableFiles(core);
    onDisableDrops(core);
    onDisableTopics(core);
    ViewsExtension.onDisable(core);

    jest.clearAllMocks();
  });
}
