import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Workspaces } from '@minddrop/workspaces';

export function setup() {}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();

  // Clear all workspaces
  Workspaces._clear();

  // Clear all event listeners
  Events._clearAll();
}
