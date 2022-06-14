import { FilesApi } from './types';
import { saveFile } from './saveFile';
import { downloadFile } from './downloadFile';
import { FileReferencesResource } from './FileReferencesResource';
import {
  getFileUrl,
  registerFileStorageAdapter,
  unregisterFileStorageAdapter,
} from './file-storage';
import { createFileReference } from './createFileReference';

export const Files: FilesApi = {
  get: FileReferencesResource.get,
  getAll: FileReferencesResource.getAll,
  getUrl: getFileUrl,
  createReference: createFileReference,
  addParents: FileReferencesResource.addParents,
  removeParents: FileReferencesResource.removeParents,
  save: saveFile,
  download: downloadFile,
  registerStorageAdapter: registerFileStorageAdapter,
  unregisterStorageAdapter: unregisterFileStorageAdapter,
  store: FileReferencesResource.store,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};
