import { Events } from '@minddrop/events';
import { BaseDirectory, Fs } from '@minddrop/file-system';
import {
  StoreHydrateEvent,
  StoreHydrateRequestEvent,
  StoreHydrateRequestEventData,
  StorePersistEvent,
  StorePersistEventData,
} from '@minddrop/stores';

const LISTENER_ID = 'desktop-app:app-data-store';
const STORES_DIR = 'stores';

/**
 * Registers event listeners that persist and hydrate
 * `app-config` level stores to JSON files in AppData.
 *
 * @returns A cleanup function that removes the listeners.
 */
export function registerAppDataStoreListeners(): VoidFunction {
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
 * Handles a store persist event by writing the store
 * data to a JSON file in the AppData stores directory.
 */
async function handlePersist({
  data,
}: {
  data: StorePersistEventData;
}): Promise<void> {
  // Only handle app-config level stores
  if (data.persistTo !== 'app-config') {
    return;
  }

  const baseDir = { baseDir: BaseDirectory.AppData };

  // Ensure the stores directory exists
  if (!(await Fs.exists(STORES_DIR, baseDir))) {
    await Fs.createDir(STORES_DIR, { ...baseDir, recursive: true });
  }

  // Write the store data to disk
  await Fs.writeJsonFile(
    `${STORES_DIR}/${data.namespace}.json`,
    data.data,
    true,
    {
      baseDir: BaseDirectory.AppData,
    },
  );
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
  // Only handle app-config level stores
  if (data.persistTo !== 'app-config') {
    return;
  }

  const filePath = `${STORES_DIR}/${data.namespace}.json`;

  // Check if the store file exists
  const fileExists = await Fs.exists(filePath, {
    baseDir: BaseDirectory.AppData,
  });

  if (!fileExists) {
    // Dispatch hydrate event with empty data
    await Events.dispatch(StoreHydrateEvent, {
      namespace: data.namespace,
      data: {},
    });

    return;
  }

  // Read the persisted store data
  const storeData = await Fs.readJsonFile(filePath, {
    baseDir: BaseDirectory.AppData,
    restoreDates: false,
  });

  // Dispatch hydrate event with the loaded data
  await Events.dispatch(StoreHydrateEvent, {
    namespace: data.namespace,
    data: storeData,
  });
}
