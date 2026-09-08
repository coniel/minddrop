import { BaseDirectory, Fs } from '@minddrop/file-system';
import { registerStoreListeners } from '@minddrop/stores';
import { Workspaces } from '@minddrop/workspaces';

const LISTENER_ID = 'app:app-workspace-config-store';
const WORKSPACES_DIR = 'workspaces';
const STORES_DIR = 'stores';

/**
 * Registers event listeners that persist and hydrate
 * `app-workspace-config` level stores to JSON files in the active
 * workspace's AppData directory.
 *
 * The directory is keyed by workspace ID rather than path, so that
 * moving or renaming a workspace directory keeps its state.
 *
 * @returns A cleanup function that removes the listeners.
 */
export function registerAppWorkspaceConfigStoreListeners(): VoidFunction {
  // Register persist and hydrate listeners targeting the stores
  // directory of the active workspace's AppData directory.
  return registerStoreListeners({
    listenerId: LISTENER_ID,
    persistTo: 'app-workspace-config',
    resolveStoresDir: () =>
      Fs.concatPath(WORKSPACES_DIR, Workspaces.getActive().id, STORES_DIR),
    baseDir: BaseDirectory.AppData,
  });
}
