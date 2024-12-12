import { NotFoundError } from '../../errors';
import { persistConfigs } from '../persistConfigs';
import { PersistentConfigsStore } from '../PersistentConfigsStore';

/**
 * Sets a value of a config.
 *
 * @param id - The config ID.
 * @param key - The key of the value to clear. Supports dot notation for nested keys.
 * @param value - The value to set.
 */
export function setConfigValue(id: string, key: string, value: unknown): void {
  // Get the config
  const config = PersistentConfigsStore.get(id);

  if (!config) {
    // If the config does not exist, throw an error
    throw new NotFoundError('Config', id);
  }

  // Turn dot notation key into list of keys
  const path = key.split('.');
  let currentKey = path.shift() || '';
  let parent = config.values;

  // Go down into the nested objects until the parent
  // object of the value to set.
  while (
    typeof parent === 'object' &&
    parent !== null &&
    currentKey &&
    path.length > 0
  ) {
    if (!(currentKey in parent)) {
      // If the parent object does not exist, create it
      parent[currentKey] = {};
    }

    parent = parent[currentKey] as Record<string, unknown>;
    currentKey = path.shift() || '';
  }

  // Set the value
  parent[currentKey] = value;

  // Set the updated config
  PersistentConfigsStore.set(config);

  // Persist the changes
  persistConfigs();
}
