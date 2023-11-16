import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { vi } from 'vitest';
import { Workspaces } from '@minddrop/workspaces';

export const core = initializeCore({ extensionId: 'minddrop:app' });

export function setup() {}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();

  // Clear all workspaces
  Workspaces._clear();

  // Remove all event listeners
  core.removeAllEventListeners();
}
