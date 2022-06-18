import { ipcMain } from 'electron';
import { getWebpageMetadata } from '@minddrop/backend-utils';
import {
  WebpageMetadataErrorPayload,
  WebpageMetadataRequestPayload,
  WebpageMetadataSuccessPayload,
} from '../types';

export function initializeBackendUtils() {
  // getWebpageMetadata listener
  ipcMain.on(
    'backend-utils:webpage-metadata:request',
    async (event, payload: WebpageMetadataRequestPayload) => {
      try {
        // Get the webpage metadata
        const metadata = await getWebpageMetadata(payload.url);

        // Create the success reply payload
        const successPayload: WebpageMetadataSuccessPayload = {
          eventId: payload.eventId,
          metadata,
        };

        // Reply to the event with the metadata
        event.reply('backend-utils:webpage-metadata:success', successPayload);
      } catch (error) {
        // Create the error reply payload
        const errorPayload: WebpageMetadataErrorPayload = {
          eventId: payload.eventId,
          error: error.message,
        };

        // Reply to the event with an error
        event.reply('backend-utils:webpage-metadata:error', errorPayload);
      }
    },
  );
}
