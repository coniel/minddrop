import { initializeCore } from '@minddrop/core';
import { ViewConfigsStore } from '../ViewConfigsStore';
import { ViewInstancesResource } from '../ViewInstancesResource';

export const core = initializeCore({ appId: 'app', extensionId: 'views' });

export function cleanup() {
  // Clear the ViewConfigsStore
  ViewConfigsStore.clear();

  // Clear the ViewInstanceResource store
  ViewInstancesResource.store.clear();

  // Clear the ViewInstanceResource type configs store
  ViewInstancesResource.typeConfigsStore.clear();

  // Remove all event listeners
  core.removeAllEventListeners();
}
