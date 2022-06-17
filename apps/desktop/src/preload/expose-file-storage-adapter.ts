import { SaveFileError } from '@minddrop/files';
import { generateId } from '@minddrop/utils';
import { ipcRenderer, contextBridge } from 'electron';
import {
  DesktopFileStorageAdapter,
  DownloadFileRequestPayload,
  DownloadFileErrorPayload,
  DownloadFileSuccessPayload,
  SaveFileRequestPayload,
  SaveFileErrorPayload,
  SaveFileSuccessPayload,
} from '../types';

/**
 * Converts a base64 string into a File object.
 *
 * @param base64 - The base64 data.
 * @param name - The file name.
 * @param type - The file mime type.
 * @retuns A File object.
 */
const base64ToFile = async (base64: string, name: string, type: string) => {
  const url = `data:${type};base64,${base64}`;
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return new File([buf], name, { type });
};

const FileStorageAdapter: DesktopFileStorageAdapter = {
  getUrl: (id: string) => `media-file://${id}`,

  save: (file, reference) =>
    new Promise((resolve) => {
      // Convert the file to a base64 string
      const reader = new FileReader();
      reader.readAsDataURL(file);

      const callback = (event, payload: SaveFileSuccessPayload) => {
        // Ensure the event ID is this call's event ID
        if (payload.eventId === reference.id) {
          // Remove success and error listeners.
          ipcRenderer.removeListener('file:save:success', callback);
          ipcRenderer.removeListener('file:save:error', errorCallback);

          // Resolve the call
          resolve();
        }
      };

      const errorCallback = (event, payload: SaveFileErrorPayload) => {
        // Ensure the event ID is this call's event ID
        if (payload.eventId === reference.id) {
          // Remove success and error listeners.
          ipcRenderer.removeListener('file:save:success', callback);
          ipcRenderer.removeListener('file:save:error', errorCallback);

          // Throw a `SaveFileError`
          throw new SaveFileError(payload.error);
        }
      };

      // Call success callback on success
      ipcRenderer.on('file:save:success', callback);
      // Call error callback on error
      ipcRenderer.on('file:save:error', errorCallback);

      reader.onload = async () => {
        // Create the request payload
        const requestPayload: SaveFileRequestPayload = {
          base64: reader.result as string,
          eventId: reference.id,
        };

        ipcRenderer.send('file:save:request', requestPayload);
      };
    }),

  download: (url) =>
    new Promise((resolve, reject) => {
      // An ID used to track the event accross the IPC
      const eventId = generateId();

      // Callback fired when the download succeeds
      const successCallback = (event, payload: DownloadFileSuccessPayload) => {
        // Creates a file object from the download data
        // and resolves the promise with it.
        async function resolveWithFile() {
          try {
            // Create a file object from the download data
            const file = await base64ToFile(
              payload.base64,
              payload.metadata.name,
              payload.metadata.type,
            );

            // Rsolve with the created file
            resolve(file);
          } catch (error) {
            // Reject with the error message
            reject(error.mssage);
          }
        }

        // Ensure the event ID is this call's event ID
        if (payload.eventId === eventId) {
          // Remove success and error listeners.
          ipcRenderer.removeListener('file:download:success', successCallback);
          ipcRenderer.removeListener('file:download:error', errorCallback);

          // Resolve with a file object created from the
          // download data.
          resolveWithFile();
        }
      };

      // Callback fired when the download fails
      function errorCallback(event, payload: DownloadFileErrorPayload) {
        // Ensure the event ID is this call's event ID
        if (payload.eventId === eventId) {
          // Remove success and error listeners.
          ipcRenderer.removeListener('file:download:success', successCallback);
          ipcRenderer.removeListener('file:download:error', errorCallback);

          // Reject with the error message
          reject(payload.error);
        }
      }

      // Call success callback on success
      ipcRenderer.on('file:download:success', successCallback);
      // Call error callback on error
      ipcRenderer.on('file:download:error', errorCallback);

      // Create the request payload
      const requestPayload: DownloadFileRequestPayload = { url, eventId };
      // Send download request to main
      ipcRenderer.send('file:download:request', requestPayload);
    }),
};

// Expose the adapter in the renderer
contextBridge.exposeInMainWorld('FileStorageAdapter', FileStorageAdapter);
