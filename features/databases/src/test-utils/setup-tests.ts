import { vi } from 'vitest';
import {
  DataTypes,
  DatabaseFixtures,
  Databases,
  coreDataTypes,
} from '@minddrop/databases';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

interface SetupOptions {
  loadDatabases?: boolean;
  loadDataTypes?: boolean;
}

initializeI18n();

export const MockFs = initializeMockFileSystem(DatabaseFixtures.databaseFiles);

export function setup(
  options: SetupOptions = { loadDatabases: true, loadDataTypes: true },
) {
  if (options.loadDatabases !== false) {
    // Load item type configs into the store
    Databases.Store.load(DatabaseFixtures.databases);
  }

  if (options.loadDataTypes !== false) {
    // Load data types into the store
    DataTypes.Store.load(coreDataTypes);
  }
}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();

  // Clear the DatabasesStore
  Databases.Store.clear();
  // Reset mock file system
  MockFs.reset();
}
