import { BackendUtilsApi, generateId } from '@minddrop/utils';
import { ipcRenderer, contextBridge } from 'electron';
import {
  WebpageMetadataRequestPayload,
  WebpageMetadataSuccessPayload,
  WebpageMetadataErrorPayload,
} from '../types';

const BackendUtilsAdapter: BackendUtilsApi = {
  getWebpageMedata: (url) =>
    new Promise((resolve) => {
      // An ID used to track the event accross the IPC
      const eventId = generateId();

      // Callback fired when the request succeeds
      const successCallback = (
        event,
        payload: WebpageMetadataSuccessPayload,
      ) => {
        // Ensure the event ID is this call's event ID
        if (payload.eventId === eventId) {
          // Remove success and error listeners.
          ipcRenderer.removeListener(
            'backend-utils:webpage-metadata:success',
            successCallback,
          );
          ipcRenderer.removeListener(
            'backend-utils:webpage-metadata:error',
            errorCallback,
          );

          // Resolve the request with the metadata
          resolve(payload.metadata);
        }
      };

      const errorCallback = (event, payload: WebpageMetadataErrorPayload) => {
        // Ensure the event ID is this call's event ID
        if (payload.eventId === eventId) {
          // Remove success and error listeners.
          ipcRenderer.removeListener(
            'backend-utils:webpage-metadata:success',
            successCallback,
          );
          ipcRenderer.removeListener(
            'backend-utils:webpage-metadata:error',
            errorCallback,
          );

          // Throw an error with the payload error message
          throw new Error(payload.error);
        }
      };

      // Call the success callback on success
      ipcRenderer.on('backend-utils:webpage-metadata:success', successCallback);
      // Call the error callback on error
      ipcRenderer.on('backend-utils:webpage-metadata:error', errorCallback);

      // Create the request payload
      const requestPayload: WebpageMetadataRequestPayload = { eventId, url };
      // Send get webpage metadata request to main
      ipcRenderer.send(
        'backend-utils:webpage-metadata:request',
        requestPayload,
      );
    }),
};

// Expose the adapter in the renderer
contextBridge.exposeInMainWorld('BackendUtilsAdapter', BackendUtilsAdapter);
