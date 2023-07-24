import { initializeCore } from '@minddrop/core';
import { WorkspacesStore } from '../WorkspacesStore';

export const core = initializeCore({ extensionId: 'minddrop:workspaces' });

export function setup() {}

export function cleanup() {
  core.removeAllEventListeners();
  WorkspacesStore.getState().clear();
}
