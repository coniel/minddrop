import { act, MockDate } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  ViewConfig,
  ViewInstances,
  Views,
  VIEWS_TEST_DATA,
} from '@minddrop/views';
import {
  LocalPersistentStore,
  GlobalPersistentStore,
} from '@minddrop/persistent-store';
import { Extensions, EXTENSIONS_TEST_DATA } from '@minddrop/extensions';
import * as ExtensionsExtension from '@minddrop/extensions';
import * as ViewsExtension from '@minddrop/views';
import * as DropsExtension from '@minddrop/drops';
import * as TopicsExtension from '@minddrop/topics';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { useAppStore } from '../useAppStore';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { onRun } from '../app-extension';

const { extensions } = EXTENSIONS_TEST_DATA;
const {
  rootTopicIds,
  topicViewConfigs,
  topicViewInstances,
  topics,
  topicViewColumnsConfig,
} = TOPICS_TEST_DATA;
const { viewInstances, viewConfigs } = VIEWS_TEST_DATA;
const { dropTypeConfigs, drops } = DROPS_TEST_DATA;

export const globalPersistentStore = { rootTopics: rootTopicIds };
export const localPersistentStore = { sidebarWidth: 302, expandedTopics: [] };

export const core = initializeCore({ appId: 'app-id', extensionId: 'app' });
export const viewsCore = initializeCore({
  appId: 'app-id',
  extensionId: 'views',
});

export const homeViewConfig: ViewConfig = {
  id: 'app:home',
  type: 'static',
  component: jest.fn(),
};

export function setup() {
  act(() => {
    [...viewConfigs, homeViewConfig].forEach((view) =>
      Views.register(core, view),
    );

    ExtensionsExtension.onRun(core);
    DropsExtension.onRun(core);
    ViewsExtension.onRun(core);
    TopicsExtension.onRun(core);

    Topics.registerView(core, topicViewColumnsConfig);

    onRun(core);

    // Register drop types
    dropTypeConfigs.forEach((config) => Drops.register(core, config));
    // Load drops
    Drops.store.load(core, drops);

    // Load topics
    Topics.store.load(core, topics);

    // Set root topics
    useAppStore.getState().addRootTopics(rootTopicIds);

    // Register extensions
    extensions.forEach((extension) => Extensions.register(core, extension));

    // Enable registered extensions on topics
    extensions.forEach((extension) =>
      Extensions.enableOnTopics(
        core,
        extension.id,
        topics.map((topic) => topic.id),
      ),
    );

    ViewInstances.store.load(viewsCore, [
      ...viewInstances,
      ...topicViewInstances,
    ]);
    topicViewConfigs.forEach((view) => Topics.registerView(core, view));

    GlobalPersistentStore.set(core, 'rootTopics', rootTopicIds);
    LocalPersistentStore.set(core, 'sidebarWidth', 302);
    LocalPersistentStore.set(core, 'expandedTopics', []);
  });
}

export function cleanup() {
  act(() => {
    LocalPersistentStore.store.clear();
    LocalPersistentStore.typeConfigsStore.clear();
    GlobalPersistentStore.store.clear();
    GlobalPersistentStore.typeConfigsStore.clear();

    Views.clear(core);
    Topics.store.clear();
    Drops.store.clear();
    Drops.typeConfigsStore.clear();
    ViewInstances.store.clear();
    core.removeAllEventListeners();
    useAppStore.getState().clear();
  });
}

MockDate.reset();
