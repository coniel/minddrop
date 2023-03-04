import { NotFoundError } from '../../errors';
import { PersistentConfigsStore } from '../PersistentConfigsStore';

/**
 * Returns a value from a config, or undefined if it
 * is not set.
 *
 * @param id - The config ID.
 * @param key - The key of the value to return. Supports dot notation for nested keys.
 * @returns The requested value or undefined.
 */
export function getConfigValue<TValue = any>(
  id: string,
  key: string,
  defaultValue: TValue,
): TValue;
export function getConfigValue<TValue = any>(
  id: string,
  key: string,
): TValue | undefined;
export function getConfigValue<TValue = any>(
  id: string,
  key: string,
  defaultValue?: TValue,
): TValue | undefined {
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
  // object of the value to get.
  while (currentKey in value && currentKey && path.length > 0) {
    value = value[currentKey];
    currentKey = path.shift() || '';
  }

  // Return the value
  return value[currentKey] || defaultValue;
}
