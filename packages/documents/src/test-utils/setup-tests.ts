import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { DocumentsStore } from '../DocumentsStore';
import { registerDocumentTypeConfig } from '../DocumentTypeConfigsStore';
import { documentTypeConfig } from './documents.data';

export function setup() {
  // Register test document type config
  registerDocumentTypeConfig(documentTypeConfig);
}

export function cleanup() {
  vi.clearAllMocks();

  // Clear all event listeners
  Events._clearAll();

  // Clear the documents store
  DocumentsStore.getState().clear();
}
