import fs from 'fs';
import path from 'path';
import os from 'os';
import { ipcMain, app, IpcMainEvent } from 'electron';
import { downloadFile } from '@minddrop/backend-utils';
import {
  DownloadFileSuccessPayload,
  DownloadFileRequestPayload,
  SaveFileRequestPayload,
  DownloadFileErrorPayload,
  SaveFileErrorPayload,
  SaveFileSuccessPayload,
} from '../types';

// Path to attachments directory which contains
// content files added by users.
const attachmentsPath = `${app.getPath('userData')}/attachments`;

export function initializeFileStorage() {
  // `save` method
  ipcMain.on(
    'file:save:request',
    (event: IpcMainEvent, payload: SaveFileRequestPayload) => {
      // Get the base64 data
      const matches = payload.base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      // Get the file path by adding the file ID to the
      // attachments path.
      const filePath = path.resolve(attachmentsPath, payload.eventId);

      // Write the file to the attachments directory
      fs.writeFile(filePath, matches[2], 'base64', (error) => {
        if (error) {
          // Create the error reply payload
          const errorPayload: SaveFileErrorPayload = {
            eventId: payload.eventId,
            error: error.message,
          };

          // Reply the the event with an error
          event.reply('file:save:error', errorPayload);
        } else {
          // Create success reply payload
          const successPayload: SaveFileSuccessPayload = {
            eventId: payload.eventId,
          };

          // Reply to the event with success
          event.reply('file:save:success', successPayload);
        }
      });
    },
  );

  // `download` method
  ipcMain.on(
    'file:download:request',
    async (event: IpcMainEvent, payload: DownloadFileRequestPayload) => {
      try {
        // Download the file
        const data = await downloadFile(payload.url, os.tmpdir());

        // Create the reply payload
        const successPayload: DownloadFileSuccessPayload = {
          eventId: payload.eventId,
          ...data,
        };

        // Reply to the event with success
        event.reply('file:download:success', successPayload);
      } catch (error) {
        // Create the error reply payload
        const errorPayload: DownloadFileErrorPayload = {
          eventId: payload.eventId,
          error: error.message,
        };

        // Reply to the event with an error
        event.reply('file:download:error', errorPayload);
      }
    },
  );
}
