import { act, MockDate } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { View, Views, VIEWS_TEST_DATA } from '@minddrop/views';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { useAppStore } from '../useAppStore';
import { PersistentStore } from '@minddrop/persistent-store';

const { views: topicViews, topicViewInstances, topics } = TOPICS_TEST_DATA;
const { viewInstances, views } = VIEWS_TEST_DATA;

export const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

export const homeView: View = {
  id: 'app:home',
  type: 'static',
  component: jest.fn(),
};

export function setup() {
  act(() => {
    [...views, ...topicViews, homeView].map((view) =>
      Views.register(core, view),
    );
    Views.loadInstances(core, [...viewInstances, ...topicViewInstances]);
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
