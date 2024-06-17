import { Events } from '@minddrop/events';
import { vi } from 'vitest';
import { WorkspacesStore } from '../WorkspacesStore';

export function setup() {}

export function cleanup() {
  vi.clearAllMocks();

  // Clear all event listeners
  Events._clearAll();

  // Clear the workspaces store
  WorkspacesStore.getState().clear();
}
