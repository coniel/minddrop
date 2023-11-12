import { vi } from 'vitest';
import { PagesStore } from '../PagesStore';
import { Events } from '@minddrop/events';

export function setup() {}

export function cleanup() {
  vi.clearAllMocks();

  // Clear all event listeners
  Events._clearAll();

  // Clear the pages store
  PagesStore.getState().clear();
}
