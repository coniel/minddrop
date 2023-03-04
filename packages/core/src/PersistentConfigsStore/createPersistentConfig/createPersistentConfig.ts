import { Config } from '../../types/Config.types';
import { clearConfigValue } from '../clearConfigValue';
import { PersistentConfigsStore } from '../PersistentConfigsStore';
import { getConfigValue } from '../getConfigValue';
import { setConfigValue } from '../setConfigValue';
import { useConfigValue } from '../useConfigValue';

/**
 * Creates a persistent config store.
 *
 * Values stored in the config store will be persisted and
 * rehydrated upon app startup.
 *
 * @param id - The ID of the config store, typically an extension ID.
 * @param defaultValues - Default values set when the store is initialized.
 */
export function createPersistentConfig(
  id: string,
  defaultValues: Record<string, any> = {},
): Config {
  if (!PersistentConfigsStore.get(id)) {
    // If the config does not appear in the store, initialize
    // it using the default values.
    PersistentConfigsStore.set({ id, values: defaultValues });
  }

  return {
    set: (key, value) => setConfigValue(id, key, value),
    get: (key, defaultValue = undefined) =>
      getConfigValue(id, key, defaultValue),
    clear: (key) => clearConfigValue(id, key),
    useValue: (key, defaultValue = undefined) => {
      const value = useConfigValue(id, key, defaultValue);

      return value;
    },
  };
}
