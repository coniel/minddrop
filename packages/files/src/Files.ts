import { FilesApi } from './types';
import { get } from './get';
import { getAllFileReferences } from './getAllFileReferences';
import { createFile } from './createFile';
import { deleteFile } from './deleteFile';
import { loadFileReferences } from './loadFileReferences';
import { clearFileReferences } from './clearFileReferences';

export const Files: FilesApi = {
  get,
  getAll: getAllFileReferences,
  create: createFile,
  delete: deleteFile,
  load: loadFileReferences,
  clear: clearFileReferences,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};
