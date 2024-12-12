import { NotFoundError } from '../../errors';
import { persistConfigs } from '../persistConfigs';
import { PersistentConfigsStore } from '../PersistentConfigsStore';

/**
 * Clears a value from a config.
 *
 * @param core - A MindDrop core instance.
 * @param id - The config ID.
 * @param key - The key of the value to clear. Supports dot notation for nested keys.
 */
export function clearConfigValue(id: string, key: string): void {
  // Get the config
  const config = PersistentConfigsStore.get(id);

  if (!config) {
    // If the config does not exist, throw an error
    throw new NotFoundError('Config', id);
  }

  // Turn dot notation key into list of keys
  const path = key.split('.');
  let currentKey = path.shift() || '';
  let value = config.values;

  // Go down into the nested objects until the parent
  // object of the value to clear.
  while (
    typeof value === 'object' &&
    value !== null &&
    currentKey in value &&
    currentKey &&
    path.length > 0
  ) {
    value = value[currentKey] as Record<string, unknown>;
    currentKey = path.shift() || '';
  }

  // Clear the value
  delete value[currentKey];

  // Set the updated config
  PersistentConfigsStore.set(config);

  // Persist the changes
  persistConfigs();
}
