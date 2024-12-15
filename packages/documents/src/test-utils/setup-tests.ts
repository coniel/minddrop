import { vi } from 'vitest';
import { Blocks } from '@minddrop/blocks';
import { Events } from '@minddrop/events';
import { DocumentViewTypeConfigsStore } from '../DocumentViewTypeConfigsStore';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { DocumentsStore } from '../DocumentsStore';

export function setup() {}

export function cleanup() {
  vi.clearAllMocks();

  // Clear all event listeners
  Events._clearAll();

  // Clear all stores
  DocumentsStore.getState().clear();
  DocumentViewsStore.getState().clear();
  DocumentViewTypeConfigsStore.clear();
  Blocks.clear();
}
