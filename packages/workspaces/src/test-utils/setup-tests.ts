import { initializeCore } from '@minddrop/core';
import { vi } from 'vitest';
import { WorkspacesStore } from '../WorkspacesStore';
import { workspace1 } from './workspaces.data';

export const core = initializeCore({ extensionId: 'minddrop:workspaces' });

export function setup() {}

export function cleanup() {
  vi.clearAllMocks();
  core.removeAllEventListeners();
  WorkspacesStore.getState().clear();
}
