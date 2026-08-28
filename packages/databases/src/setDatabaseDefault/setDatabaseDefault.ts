import { DatabaseDefaultsStore } from '../DatabaseDefaultsStore';
import { DatabaseDefaults } from '../types';

/**
 * Sets a default applied to newly created databases.
 *
 * @param key - The default to set.
 * @param value - The value to set it to.
 */
export function setDatabaseDefault<TKey extends keyof DatabaseDefaults>(
  key: TKey,
  value: DatabaseDefaults[TKey],
): void {
  // Update the default in the store
  DatabaseDefaultsStore.set(key, value);
}
