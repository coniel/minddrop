import { Fs } from '@minddrop/file-system';
import { registerStoreListeners } from '@minddrop/stores';
import { Workspaces } from '@minddrop/workspaces';

const LISTENER_ID = 'app:app-workspace-config-store';
const STORES_DIR = 'stores';

/**
 * Registers event listeners that persist and hydrate
 * `app-workspace-config` level stores to JSON files in the data
 * directory of the workspace the event is for: the one a workspace
 * scoped store carries, else the active workspace.
 *
 * @returns A cleanup function that removes the listeners.
 */
export function registerAppWorkspaceConfigStoreListeners(): VoidFunction {
  // Register persist and hydrate listeners targeting the stores
  // directory of the workspace's data directory.
  return registerStoreListeners({
    listenerId: LISTENER_ID,
    target: 'app-workspace-config',
    resolveStoresDir: (workspaceId) =>
      Fs.concatPath(
        Workspaces.resolveDataDirPath(workspaceId ?? Workspaces.getActive().id),
        STORES_DIR,
      ),
  });
}
