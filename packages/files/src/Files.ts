import { FilesApi } from './types';
import { get } from './get';
import { getAllFileReferences } from './getAllFileReferences';
import { createFile } from './createFile';
import { deleteFile } from './deleteFile';
import { addAttachments } from './addAttachments';
import { removeAttachments } from './removeAttachments';
import { replaceAttachments } from './replaceAttachments';
import { loadFileReferences } from './loadFileReferences';
import { clearFileReferences } from './clearFileReferences';

export const Files: FilesApi = {
  get,
  getAll: getAllFileReferences,
  create: createFile,
  delete: deleteFile,
  addAttachments,
  removeAttachments,
  replaceAttachments,
  load: loadFileReferences,
  clear: clearFileReferences,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};
