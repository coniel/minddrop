import { initializeCore } from '@minddrop/core';
import { FileStorageApi } from '../types';
import { FileReferencesResource } from '../FileReferencesResource';
import { textFileRef1 } from './files.data';

export const core = initializeCore({ appId: 'app', extensionId: 'files' });

export const fileStorageAdapter: FileStorageApi = {
  getUrl: () => 'file-url',
  save: async () => textFileRef1,
  download: async () => textFileRef1,
};

export function cleanup() {
  // Clear all event listeners
  core.removeAllEventListeners();

  // Clear the file references store
  FileReferencesResource.store.clear();
}
