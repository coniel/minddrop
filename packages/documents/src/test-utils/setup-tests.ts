import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Blocks } from '@minddrop/blocks';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { DocumentViewTypeConfigsStore } from '../DocumentViewTypeConfigsStore';

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
