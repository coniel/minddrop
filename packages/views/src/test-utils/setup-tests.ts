import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { ViewTypesStore } from '../ViewTypesStore';
import { viewTypes } from './fixtures';

interface SetupOptions {
  loadViewTypes?: boolean;
}

export function setup(
  options: SetupOptions = {
    loadViewTypes: true,
  },
) {
  if (options.loadViewTypes !== false) {
    // Load view types into the store
    ViewTypesStore.load(viewTypes);
  }
}

export function cleanup() {
  vi.clearAllMocks();
  // Clear stores
  ViewTypesStore.clear();
  // Clear all event listeners
  Events._clearAll();
}
