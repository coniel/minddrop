import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentViewsStore } from '../DocumentViewsStore';

export function setup() {}

export function cleanup() {
  vi.clearAllMocks();

  // Clear all event listeners
  Events._clearAll();

  // Clear all stores
  DocumentsStore.getState().clear();
  DocumentViewsStore.getState().clear();
}
