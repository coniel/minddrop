import { createKeyValueStore } from '@minddrop/stores';
import { DatabaseDefaults } from './types';

// Built-in defaults used until the user configures their own
const defaultValues: DatabaseDefaults = {
  entrySerializer: 'markdown',
  propertyFileStorage: 'property',
  entryOpenMode: 'in-place',
};

export const DatabaseDefaultsStore = createKeyValueStore<DatabaseDefaults>(
  'Databases:Defaults',
  defaultValues,
  {
    persistTo: 'workspace-config',
    namespace: 'database-defaults',
  },
);

/**
 * Retrieves the defaults applied to newly created databases.
 *
 * @returns The database defaults.
 */
export const useDatabaseDefaults = (): DatabaseDefaults => {
  return DatabaseDefaultsStore.useAllValues();
};
