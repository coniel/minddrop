import { vi } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { DataTypesStore } from '../DataTypesStore';
import { DatabasesStore } from '../DatabasesStore';
import { coreDataTypes } from '../data-type-configs';
import { databaseFiles, databases } from './fixtures';

interface SetupOptions {
  loadDatabases?: boolean;
  loadDataTypes?: boolean;
}

initializeI18n();

export const MockFs = initializeMockFileSystem(databaseFiles);

export function setup(
  options: SetupOptions = { loadDatabases: true, loadDataTypes: true },
) {
  if (options.loadDatabases !== false) {
    // Load item type configs into the store
    DatabasesStore.load(databases);
  }

  if (options.loadDataTypes !== false) {
    // Load data types into the store
    DataTypesStore.load(coreDataTypes);
  }
}

export function cleanup() {
  vi.clearAllMocks();
  // Clear the DatabasesStore
  DatabasesStore.clear();
  // Reset mock file system
  MockFs.reset();
}
