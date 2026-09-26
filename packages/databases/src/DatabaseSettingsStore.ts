import { createKeyValueStore } from '@minddrop/stores';
import {
  CustomContentType,
  DatabaseContentDefaults,
  DatabaseDefaults,
  DatabaseSettings,
} from './types';

// Built-in settings used until the user configures their own
const defaultValues: DatabaseSettings = {
  defaults: {
    entrySerializer: 'markdown',
    propertyFileStorage: 'property',
    entryOpenMode: 'in-place',
  },
  contentDefaults: {
    text: null,
    url: null,
    image: null,
    pdf: null,
    audio: null,
    video: null,
    file: null,
    customTypes: [],
  },
};

export const DatabaseSettingsStore = createKeyValueStore<DatabaseSettings>(
  'Databases:Settings',
  defaultValues,
  {
    persist: { target: 'workspace-config', namespace: 'database-settings' },
    scope: 'workspace',
  },
);

/**
 * Retrieves the defaults applied to newly created databases.
 *
 * @returns The database defaults.
 */
export const useDatabaseDefaults = (): DatabaseDefaults => {
  return DatabaseSettingsStore.useValue('defaults');
};

/**
 * Retrieves the databases that content added from outside the app is
 * added to.
 *
 * @returns The database content defaults.
 */
export const useDatabaseContentDefaults = (): DatabaseContentDefaults => {
  return DatabaseSettingsStore.useValue('contentDefaults');
};

/**
 * Retrieves the user-defined content types, in creation order.
 *
 * @returns The custom content types.
 */
export const useCustomContentTypes = (): CustomContentType[] => {
  return DatabaseSettingsStore.useValue('contentDefaults').customTypes;
};
