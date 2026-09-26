import { DatabaseSettingsStore } from '../DatabaseSettingsStore';
import { DatabaseContentDefaults } from '../types';

/**
 * Retrieves the databases that content added from outside the app is
 * added to.
 *
 * @returns The database content defaults.
 */
export function getDatabaseContentDefaults(): DatabaseContentDefaults {
  return DatabaseSettingsStore.get('contentDefaults');
}
