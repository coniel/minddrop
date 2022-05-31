import { FilesApi } from './types';
import { saveFile } from './saveFile';
import { FileReferencesResource } from './FileReferencesResource';

export const Files: FilesApi = {
  save: saveFile,
  get: FileReferencesResource.get,
  getAll: FileReferencesResource.getAll,
  addParents: FileReferencesResource.addParents,
  removeParents: FileReferencesResource.removeParents,
  store: FileReferencesResource.store,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};
