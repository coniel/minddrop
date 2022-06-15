import { ipcMain } from 'electron';
import { getWebpageMetadata } from '@minddrop/backend-utils';

export function initializeBackendUtils() {
  // getWebpageMetadata listener
  ipcMain.on('backend-utils:getWebpageMetadata', async (event, url: string) => {
    try {
      // Get the webpage metadata
      const metadata = await getWebpageMetadata(url);

      // Reply to the event with the metadata
      event.reply('backend-utils:webpage-metadata', metadata);
    } catch (error) {
      // Reply to the event with an error
      event.reply('backend-utils:webpage-metadata-error', error.message);
    }
  });
}
