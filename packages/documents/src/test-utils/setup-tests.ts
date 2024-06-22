import { vi } from 'vitest';
import { DocumentsStore } from '../DocumentsStore';
import { Events } from '@minddrop/events';

export function setup() {}

export function cleanup() {
  vi.clearAllMocks();

  // Clear all event listeners
  Events._clearAll();

  // Clear the documents store
  DocumentsStore.getState().clear();
}
