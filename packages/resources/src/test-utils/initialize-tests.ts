import { initializeCore } from '@minddrop/core';

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

export function setup() {
  //
}

export function cleanup() {
  // Remove all event listeners for this extension
  core.removeAllEventListeners();
}
