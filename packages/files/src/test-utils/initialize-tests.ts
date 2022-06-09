import { initializeCore } from '@minddrop/core';
import { FileReferencesResource } from '../FileReferencesResource';

export const core = initializeCore({ appId: 'app', extensionId: 'files' });

export function cleanup() {
  // Clear all event listeners
  core.removeAllEventListeners();

  // Clear the file references store
  FileReferencesResource.store.clear();
}
