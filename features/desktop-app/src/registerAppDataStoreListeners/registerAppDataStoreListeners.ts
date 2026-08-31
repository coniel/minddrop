import { BaseDirectory } from '@minddrop/file-system';
import { registerStoreListeners } from '@minddrop/stores';

const LISTENER_ID = 'desktop-app:app-data-store';
const STORES_DIR = 'stores';

/**
 * Registers event listeners that persist and hydrate
 * `app-config` level stores to JSON files in AppData.
 *
 * @returns A cleanup function that removes the listeners.
 */
export function registerAppDataStoreListeners(): VoidFunction {
  // Register persist and hydrate listeners targeting the
  // AppData stores directory
  return registerStoreListeners({
    listenerId: LISTENER_ID,
    persistTo: 'app-config',
    getStoresDir: () => STORES_DIR,
    baseDir: BaseDirectory.AppData,
  });
}
