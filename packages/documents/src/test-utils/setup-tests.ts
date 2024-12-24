import { vi } from 'vitest';
import { Blocks } from '@minddrop/blocks';
import { Events } from '@minddrop/events';
import { DocumentViewTypeConfigsStore } from '../DocumentViewTypeConfigsStore';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { DocumentsStore } from '../DocumentsStore';
import {
  documentBlocks,
  documentViews,
  documents,
  viewTypeConfigs,
} from './documents.data';

export function setup() {
  // Load test documents into the store
  DocumentsStore.getState().load(documents);
  // Load test document views into the store
  DocumentViewsStore.getState().load(documentViews);
  // Load view type configs into the store
  DocumentViewTypeConfigsStore.load(viewTypeConfigs);
  // Load tst blocks into the store
  Blocks.load(documentBlocks);
}

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
