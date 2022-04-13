import { initializeCore } from '@minddrop/core';
import { ResourceApisStore } from '../ResourceApisStore';

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

export function setup() {
  //
}

export function cleanup() {
  // Clear all registered resource configs
  ResourceApisStore.clear();

  // Remove all event listeners for this extension
  core.removeAllEventListeners();
}
