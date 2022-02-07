import { act, MockDate } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { View, ViewInstance, Views } from '@minddrop/views';
import { generateTopic, Topic, Topics } from '@minddrop/topics';
import { useAppStore } from '../useAppStore';
import { PersistentStore } from '@minddrop/persistent-store';

export const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

MockDate.set('01/01/2000');

export const homeView: View = {
  id: 'app:home',
  type: 'static',
  component: jest.fn(),
};

export const topicView: View = {
  id: 'app:topic',
  type: 'instance',
  component: jest.fn(),
};

export const staticView: View = {
  id: 'static-view',
  type: 'static',
  component: jest.fn(),
};

export const instanceView: View = {
  id: 'view-instance',
  type: 'instance',
  component: jest.fn(),
};

export const unregisteredView: View = {
  id: 'unregistered-view',
  type: 'instance',
  component: jest.fn(),
};

export const viewInstance1: ViewInstance = {
  id: 'view-instance1-id',
  view: 'view-instance',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const viewInstance2: ViewInstance = {
  id: 'view-instance2-id',
  view: 'view-instance',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const topic1: Topic = {
  ...generateTopic({ views: [viewInstance1.id, viewInstance2.id] }),
  id: 'topic-1',
};

export const topic2: Topic = {
  ...generateTopic({ views: [viewInstance2.id] }),
  id: 'topic-2',
};

export function setup() {
  act(() => {
    Views.register(core, homeView);
    Views.register(core, topicView);
    Views.register(core, staticView);
    Views.register(core, instanceView);
    Views.loadInstances(core, [viewInstance1, viewInstance2]);
    Topics.load(core, [topic1, topic2]);
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
