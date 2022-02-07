import { act, MockDate } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { ViewInstance, View } from '../types';
import { useViewsStore } from '../useViewsStore';

MockDate.set('01/01/2000');

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

export const viewInstance: ViewInstance = {
  id: 'view-instance-id',
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

export const core = initializeCore({ appId: 'app', extensionId: 'views' });

export function setup() {
  act(() => {
    const store = useViewsStore.getState();
    store.setView(staticView);
    store.setView(instanceView);
    store.loadInstances([viewInstance, viewInstance2]);
  });
}

export function cleanup() {
  act(() => {
    useViewsStore.getState().clear();
    core.removeAllEventListeners();
  });
}

MockDate.reset();
