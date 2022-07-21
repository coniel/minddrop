import Store from 'electron-store';
import { v4 as uuid } from 'uuid';
import { ipcMain } from 'electron';

export function initializeStore() {
  const store = new Store();

  if (!store.get('appId')) {
    // Generate an app ID if there is none
    store.set('appId', uuid());
  }

  ipcMain.handle('store:value:get', (event, key: string) => {
    return store.get(key);
  });

  return store;
}
