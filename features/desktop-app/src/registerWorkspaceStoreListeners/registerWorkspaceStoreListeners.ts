import { Fs } from '@minddrop/file-system';
import { registerStoreListeners } from '@minddrop/stores';
import { Paths } from '@minddrop/utils';

const LISTENER_ID = 'desktop-app:workspace-store';
const STORES_DIR = 'stores';

/**
 * Registers event listeners that persist and hydrate
 * `workspace-config` level stores to JSON files in the
 * workspace's config directory.
 *
 * @returns A cleanup function that removes the listeners.
 */
export function registerWorkspaceStoreListeners(): VoidFunction {
  // Register persist and hydrate listeners targeting the stores
  // directory inside the active workspace's config directory
  return registerStoreListeners({
    listenerId: LISTENER_ID,
    persistTo: 'workspace-config',
    getStoresDir: () => Fs.concatPath(Paths.workspaceConfigs, STORES_DIR),
  });
}
