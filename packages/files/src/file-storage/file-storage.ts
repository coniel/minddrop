import { AdapterNotRegisteredError } from '@minddrop/utils';
import { FileStorageApi } from '../types';

function throwError(): any {
  throw new AdapterNotRegisteredError('files storage');
}

const placeholderApi: FileStorageApi = {
  getUrl: throwError,
  save: throwError,
  download: throwError,
};

let api = placeholderApi;

/**
 * Registers a file storage adapter.
 *
 * @param adapter - A file storage adapter.
 */
export function registerFileStorageAdapter(adapter: FileStorageApi) {
  api = adapter;
}

/**
 * **Intended for use in tests only.**
 *
 * Unregisters the registered file storage adapter.
 */
export function unregisterFileStorageAdapter() {
  api = placeholderApi;
}

export const getFileUrl: FileStorageApi['getUrl'] = (fileId) =>
  api.getUrl(fileId);

export const saveFileToStorage: FileStorageApi['save'] = (core, file) =>
  api.save(core, file);

export const downloadFileToStorage: FileStorageApi['download'] = (core, url) =>
  api.download(core, url);
