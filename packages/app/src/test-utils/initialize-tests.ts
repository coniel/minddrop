import { act, MockDate } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { ViewConfig, Views, VIEWS_TEST_DATA } from '@minddrop/views';
import { Extensions, EXTENSIONS_TEST_DATA } from '@minddrop/extensions';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { useAppStore } from '../useAppStore';
import { PersistentStore } from '@minddrop/persistent-store';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';

const { extensions } = EXTENSIONS_TEST_DATA;
const { topicViewConfigs, topicViewInstances, topics } = TOPICS_TEST_DATA;
const { viewInstances, viewConfigs } = VIEWS_TEST_DATA;
const { dropTypeConfigs, drops } = DROPS_TEST_DATA;

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
    // Register drop types
    dropTypeConfigs.forEach((config) => Drops.register(core, config));
    // Load drops
    Drops.load(core, drops);

    // Load topics
    Topics.load(core, topics);

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

    [...viewConfigs, homeViewConfig].forEach((view) =>
      Views.register(viewsCore, view),
    );
    Views.loadInstances(viewsCore, [...viewInstances, ...topicViewInstances]);
    topicViewConfigs.forEach((view) => Topics.registerView(core, view));
  });
}

export function cleanup() {
  act(() => {
    Views.clear(core);
    core.removeAllEventListeners();
    useAppStore.getState().clear();
    PersistentStore.clearLocalCache();
    Topics.clear(core);
  });
}

MockDate.reset();
