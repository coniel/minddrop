import { DatabaseSettingsStore } from '../DatabaseSettingsStore';
import { DatabaseDefaults } from '../types';

/**
 * Retrieves the defaults applied to newly created databases.
 *
 * @returns The database defaults.
 */
export function getDatabaseDefaults(): DatabaseDefaults {
  return DatabaseSettingsStore.get('defaults');
}
