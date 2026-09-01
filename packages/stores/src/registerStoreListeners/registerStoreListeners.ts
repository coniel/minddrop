import { Events } from '@minddrop/events';
import { BaseDirectory, Fs } from '@minddrop/file-system';
import {
  StoreHydrateEvent,
  StoreHydrateRequestEvent,
  StoreHydrateRequestEventData,
  StorePersistEvent,
  StorePersistEventData,
} from '../events';

export interface RegisterStoreListenersConfig {
  /**
   * ID used to register the persist and hydrate event listeners.
   */
  listenerId: string;

  /**
   * The persist level of the stores handled by the listeners.
   */
  persistTo: StorePersistEventData['persistTo'];

  /**
   * Returns the directory in which store files are written.
   * Called on every event so the path tracks runtime changes,
   * such as the active workspace.
   */
  resolveStoresDir: () => string;

  /**
   * The base directory against which the stores directory
   * path is resolved.
   */
  baseDir?: BaseDirectory;
}

/**
 * Registers event listeners that persist and hydrate stores of the
 * configured persist level to JSON files in the configured directory.
 *
 * @param config - The persist level and target directory configuration.
 * @returns A cleanup function that removes the listeners.
 */
export function registerStoreListeners(
  config: RegisterStoreListenersConfig,
): VoidFunction {
  // Listen for store persist events and write data to disk
  Events.addListener(StorePersistEvent, config.listenerId, (event) =>
    handlePersist(config, event.data),
  );

  // Listen for store hydrate requests and read data from disk
  Events.addListener(StoreHydrateRequestEvent, config.listenerId, (event) =>
    handleHydrateRequest(config, event.data),
  );

  return () => {
    Events.removeListener(StorePersistEvent, config.listenerId);
    Events.removeListener(StoreHydrateRequestEvent, config.listenerId);
  };
}

/**
 * Handles a store persist event by writing the store
 * data to a JSON file in the stores directory.
 */
async function handlePersist(
  config: RegisterStoreListenersConfig,
  data: StorePersistEventData,
): Promise<void> {
  // Only handle stores persisted at the configured level
  if (data.persistTo !== config.persistTo) {
    return;
  }

  // Resolve the stores directory
  const storesDir = config.resolveStoresDir();

  // File system options targeting the configured base directory
  const fsOptions = { baseDir: config.baseDir };

  // Ensure the stores directory exists
  if (!(await Fs.exists(storesDir, fsOptions))) {
    await Fs.createDir(storesDir, { ...fsOptions, recursive: true });
  }

  // Write the store data to disk
  await Fs.writeJsonFile(
    Fs.concatPath(storesDir, `${data.namespace}.json`),
    data.data,
    true,
    fsOptions,
  );
}

/**
 * Handles a store hydrate request by reading the store
 * data from disk and dispatching a hydrate event.
 */
async function handleHydrateRequest(
  config: RegisterStoreListenersConfig,
  data: StoreHydrateRequestEventData,
): Promise<void> {
  // Only handle stores persisted at the configured level
  if (data.persistTo !== config.persistTo) {
    return;
  }

  // Resolve the store file path
  const filePath = Fs.concatPath(
    config.resolveStoresDir(),
    `${data.namespace}.json`,
  );

  // File system options targeting the configured base directory
  const fsOptions = { baseDir: config.baseDir };

  // Check if the store file exists
  if (!(await Fs.exists(filePath, fsOptions))) {
    // Dispatch hydrate event with empty data
    await Events.dispatch(StoreHydrateEvent, {
      namespace: data.namespace,
      data: {},
    });

    return;
  }

  // Read the persisted store data
  const storeData = await Fs.readJsonFile<Record<string, unknown> | unknown[]>(
    filePath,
    {
      ...fsOptions,
      restoreDates: false,
    },
  );

  // Dispatch hydrate event with the loaded data
  await Events.dispatch(StoreHydrateEvent, {
    namespace: data.namespace,
    data: storeData,
  });
}
