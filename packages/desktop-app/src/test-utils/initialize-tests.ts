import { cleanup as cleanupRender, MockFsAdapter } from '@minddrop/test-utils';
import { initializeCore, registerFileSystemAdapter } from '@minddrop/core';

export const core = initializeCore({ extensionId: 'minddrop:app' });

export function setup() {
  registerFileSystemAdapter(MockFsAdapter);
}

export function cleanup() {
  cleanupRender();

  // Remove all event listeners
  core.removeAllEventListeners();
}
