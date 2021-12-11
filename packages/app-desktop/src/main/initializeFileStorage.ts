import fs from 'fs';
import path from 'path';
import { ipcMain, app } from 'electron';

const attachmentsPath = `${app.getPath('userData')}/attachments`;

export function initializeFileStorage() {
  ipcMain.on('files:getAttachmentsPath', (event) => {
    // eslint-disable-next-line no-param-reassign
    event.returnValue = attachmentsPath;
  });

  ipcMain.on('files:get', async (event, id) => {
    try {
      fs.readFile(
        path.resolve(attachmentsPath, id),
        {
          encoding: 'base64',
        },
        (err, base64) => {
          event.reply('files:got', { base64, id });
        },
      );
    } catch (error) {
      event.reply('files:error', error.message);
    }
  });

  ipcMain.on('files:create', (event, payload) => {
    const matches = payload.base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    const filePath = path.resolve(attachmentsPath, payload.id);

    fs.writeFile(filePath, matches[2], 'base64', (error) => {
      if (error) {
        event.reply('files:error', error.message);
      }
    });
  });
}
