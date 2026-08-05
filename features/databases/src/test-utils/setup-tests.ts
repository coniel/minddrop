import { vi } from 'vitest';
import { DataViewFixtures, DataViewTypes } from '@minddrop/data-views';
import {
  DatabaseFixtures,
  DatabaseTemplates,
  Databases,
} from '@minddrop/databases';
import { DesignFixtures, Designs } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { Paths } from '@minddrop/utils';

const { dataViewType_table } = DataViewFixtures;

interface SetupOptions {
  loadDatabases?: boolean;
  loadDatabaseTemplates?: boolean;
  loadDesigns?: boolean;
}

initializeI18n();

export const MockFs = initializeMockFileSystem([
  Paths.workspace,
  ...DatabaseFixtures.databaseFiles,
]);

export function setup(
  options: SetupOptions = {
    loadDatabases: true,
    loadDatabaseTemplates: true,
    loadDesigns: true,
  },
) {
  if (options.loadDatabases !== false) {
    // Load item type configs into the store
    Databases.Store.load(DatabaseFixtures.databases);
  }

  if (options.loadDatabaseTemplates !== false) {
    // Load database templates into the store
    DatabaseTemplates.initialize();
  }

  if (options.loadDesigns !== false) {
    // Load designs into the store so their inner layouts are queryable
    Designs.Store.load(DesignFixtures.designs);
  }

  // Load view types into the store
  DataViewTypes.register(dataViewType_table);
}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
  Events._clearAll();

  // Clear stores
  Databases.Store.clear();
  DatabaseTemplates.Store.clear();
  Designs.Store.clear();
  DataViewTypes.Store.clear();
  // Reset mock file system
  MockFs.reset();
}
