import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import {
  StoreHydrateEvent,
  StoreHydrateRequestEvent,
  StoreHydrateRequestEventData,
  StorePersistEvent,
  StorePersistEventData,
} from '@minddrop/stores';
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
  // Listen for store persist events and write data to disk
  Events.addListener<StorePersistEventData>(
    StorePersistEvent,
    LISTENER_ID,
    handlePersist,
  );

  // Listen for store hydrate requests and read data from disk
  Events.addListener<StoreHydrateRequestEventData>(
    StoreHydrateRequestEvent,
    LISTENER_ID,
    handleHydrateRequest,
  );

  return () => {
    Events.removeListener(StorePersistEvent, LISTENER_ID);
    Events.removeListener(StoreHydrateRequestEvent, LISTENER_ID);
  };
}

/**
 * Returns the absolute path to the workspace stores directory.
 */
function getStoresDir(): string {
  return Fs.concatPath(Paths.workspaceConfigs, STORES_DIR);
}

/**
 * Handles a store persist event by writing the store
 * data to a JSON file in the workspace stores directory.
 */
async function handlePersist({
  data,
}: {
  data: StorePersistEventData;
}): Promise<void> {
  // Only handle workspace-config level stores
  if (data.persistTo !== 'workspace-config') {
    return;
  }

  const storesDir = getStoresDir();

  // Ensure the stores directory exists
  if (!(await Fs.exists(storesDir))) {
    await Fs.createDir(storesDir, { recursive: true });
  }

  // Write the store data to disk
  const filePath = Fs.concatPath(storesDir, `${data.namespace}.json`);

  await Fs.writeJsonFile(filePath, data.data, true);
}

/**
 * Handles a store hydrate request by reading the store
 * data from disk and dispatching a hydrate event.
 */
async function handleHydrateRequest({
  data,
}: {
  data: StoreHydrateRequestEventData;
}): Promise<void> {
  // Only handle workspace-config level stores
  if (data.persistTo !== 'workspace-config') {
    return;
  }

  const filePath = Fs.concatPath(getStoresDir(), `${data.namespace}.json`);

  // Check if the store file exists
  if (!(await Fs.exists(filePath))) {
    // Dispatch hydrate event with empty data
    await Events.dispatch(StoreHydrateEvent, {
      namespace: data.namespace,
      data: {},
    });

    return;
  }

  // Read the persisted store data
  const storeData = await Fs.readJsonFile(filePath, {
    restoreDates: false,
  });

  // Dispatch hydrate event with the loaded data
  await Events.dispatch(StoreHydrateEvent, {
    namespace: data.namespace,
    data: storeData,
  });
}
