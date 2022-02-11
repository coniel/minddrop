import { act, MockDate } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { ViewConfig, Views, VIEWS_TEST_DATA } from '@minddrop/views';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { useAppStore } from '../useAppStore';
import { PersistentStore } from '@minddrop/persistent-store';

const { topicViewConfigs, topicViewInstances, topics } = TOPICS_TEST_DATA;
const { viewInstances, viewConfigs } = VIEWS_TEST_DATA;

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
      Views.register(viewsCore, view),
    );
    Views.loadInstances(viewsCore, [...viewInstances, ...topicViewInstances]);
    topicViewConfigs.forEach((view) => Topics.registerView(core, view));
    Topics.load(core, topics);
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
