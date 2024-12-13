import { Config } from '../../types/Config.types';
import { PersistentConfigsStore } from '../PersistentConfigsStore';
import { NotFoundError } from '../../errors';
import { persistConfigs } from '../persistConfigs';

/**
 * Creates a persistent config store.
 *
 * Values stored in the config store will be persisted and
 * rehydrated upon app startup.
 *
 * @param id - The ID of the config store, typically an extension ID.
 * @param defaultValues - Default values set when the store is initialized.
 */
export function createPersistentConfig<TValues extends object>(
  id: string,
  defaultValues: Partial<TValues>,
): Config<TValues> {
  if (!PersistentConfigsStore.get(id)) {
    // If the config does not appear in the store, initialize
    // it using the default values.
    PersistentConfigsStore.set({ id, values: defaultValues });
  }

  return {
    get<TKey extends keyof TValues>(key: TKey, defaultValue?: TValues[TKey]) {
      const config = PersistentConfigsStore.get(id);

      if (!config) {
        // If the config does not exist, throw an error
        throw new NotFoundError('Config', id);
      }

      return (config.values as TValues)[key] || defaultValue;
    },
    set<TKey extends keyof TValues>(key: TKey, value: TValues[TKey]) {
      const config = PersistentConfigsStore.get(id);

      if (!config) {
        // If the config does not exist, throw an error
        throw new NotFoundError('Config', id);
      }

      // Set the value
      (config.values as TValues)[key] = value;

      // Set the updated config
      PersistentConfigsStore.set(config);

      // Persist the changes
      persistConfigs();
    },
    clear<TKey extends keyof TValues>(key: TKey) {
      // Get the config
      const config = PersistentConfigsStore.get(id);

      if (!config) {
        // If the config does not exist, throw an error
        throw new NotFoundError('Config', id);
      }

      // Clear the value
      delete (config.values as TValues)[key];

      // Set the updated config
      PersistentConfigsStore.set(config);

      // Persist the changes
      persistConfigs();
    },
    useValue<TKey extends keyof TValues>(
      key: TKey,
      defaultValue = defaultValues[key],
    ) {
      const useConfig = PersistentConfigsStore.useItem(id);

      if (!useConfig) {
        // If the config does not exist, throw an error
        throw new NotFoundError('Config', id);
      }

      // Return the value
      return (useConfig.values as TValues)[key] || defaultValue;
    },
  };
}
