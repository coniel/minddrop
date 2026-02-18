import { vi } from 'vitest';
import {
  DatabaseFixtures,
  DatabaseTemplates,
  Databases,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { Paths } from '@minddrop/utils';
import { ViewFixtures, ViewTypes } from '@minddrop/views';

const { wallViewType } = ViewFixtures;

interface SetupOptions {
  loadDatabases?: boolean;
  loadDatabaseTemplates?: boolean;
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

  // Load view types into the store
  ViewTypes.register(wallViewType);
}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
  Events._clearAll();

  // Clear stores
  Databases.Store.clear();
  DatabaseTemplates.Store.clear();
  ViewTypes.Store.clear();
  // Reset mock file system
  MockFs.reset();
}
