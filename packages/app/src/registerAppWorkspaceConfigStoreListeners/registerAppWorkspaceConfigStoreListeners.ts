import { Fs } from '@minddrop/file-system';
import { registerStoreListeners } from '@minddrop/stores';
import { Workspaces } from '@minddrop/workspaces';

const LISTENER_ID = 'app:app-workspace-config-store';
const STORES_DIR = 'stores';

/**
 * Registers event listeners that persist and hydrate
 * `app-workspace-config` level stores to JSON files in the active
 * workspace's data directory.
 *
 * @returns A cleanup function that removes the listeners.
 */
export function registerAppWorkspaceConfigStoreListeners(): VoidFunction {
  // Register persist and hydrate listeners targeting the stores
  // directory of the active workspace's data directory.
  return registerStoreListeners({
    listenerId: LISTENER_ID,
    persistTo: 'app-workspace-config',
    resolveStoresDir: () =>
      Fs.concatPath(
        Workspaces.resolveDataDirPath(Workspaces.getActive().id),
        STORES_DIR,
      ),
  });
}
