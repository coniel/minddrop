import { BaseDirectory } from '@minddrop/file-system';
import { registerStoreListeners } from '@minddrop/stores';

const LISTENER_ID = 'app:app-config-store';
const STORES_DIR = 'stores';

/**
 * Registers event listeners that persist and hydrate
 * `app-config` level stores to JSON files in AppData.
 *
 * These stores hold state belonging to the app on this device,
 * whichever workspace is open.
 *
 * @returns A cleanup function that removes the listeners.
 */
export function registerAppConfigStoreListeners(): VoidFunction {
  // Register persist and hydrate listeners targeting the
  // AppData stores directory.
  return registerStoreListeners({
    listenerId: LISTENER_ID,
    persistTo: 'app-config',
    resolveStoresDir: () => STORES_DIR,
    baseDir: BaseDirectory.AppData,
  });
}
