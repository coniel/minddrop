import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { useViewsStore } from '../useViewsStore';
import {
  instanceView,
  staticView,
  viewInstance1,
  viewInstance2,
} from './views.data';

export const core = initializeCore({ appId: 'app', extensionId: 'views' });

export function setup() {
  act(() => {
    const store = useViewsStore.getState();
    store.setView(staticView);
    store.setView(instanceView);
    store.loadInstances([viewInstance1, viewInstance2]);
  });
}

export function cleanup() {
  act(() => {
    useViewsStore.getState().clear();
    core.removeAllEventListeners();
  });
}
