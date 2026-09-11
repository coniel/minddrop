import { Fs } from '@minddrop/file-system';
import { registerStoreListeners } from '@minddrop/stores';
import { Workspaces } from '@minddrop/workspaces';

const LISTENER_ID = 'app:workspace-config-store';
const STORES_DIR = 'stores';

/**
 * Registers event listeners that persist and hydrate
 * `workspace-config` level stores to JSON files in the config
 * directory of the workspace the event is for: the one a workspace
 * scoped store carries, else the active workspace.
 *
 * These stores hold state belonging to the workspace itself, which
 * travels with it to every device it syncs to. State specific to one
 * workspace on one device goes to `app-workspace-config` instead.
 *
 * @returns A cleanup function that removes the listeners.
 */
export function registerWorkspaceConfigStoreListeners(): VoidFunction {
  // Register persist and hydrate listeners targeting the stores
  // directory inside the workspace's config directory.
  return registerStoreListeners({
    listenerId: LISTENER_ID,
    target: 'workspace-config',
    resolveStoresDir: (workspaceId) =>
      Fs.concatPath(
        Workspaces.resolveConfigDirPath(
          workspaceId ?? Workspaces.getActive().id,
        ),
        STORES_DIR,
      ),
  });
}
