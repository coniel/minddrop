import { vi } from 'vitest';
import { DataViewTypes } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import {
  DatabaseEntryTemplates,
  DatabaseTemplates,
  Databases,
} from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Designs } from '@minddrop/designs';
import { Designs as DesignsNext } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { Paths } from '@minddrop/utils';

const { dataViewType_table } = DataViewFixtures;

interface SetupOptions {
  loadDatabases?: boolean;
  loadDatabaseEntryTemplates?: boolean;
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
    loadDatabaseEntryTemplates: true,
    loadDatabaseTemplates: true,
    loadDesigns: true,
  },
) {
  if (options.loadDatabases !== false) {
    // Load item type configs into the store
    Databases.Store.load(DatabaseFixtures.databases);
  }

  if (options.loadDatabaseEntryTemplates !== false) {
    // Load entry templates into the store
    DatabaseEntryTemplates.Store.load(DatabaseFixtures.databaseEntryTemplates);
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

export async function cleanup(): Promise<void> {
  cleanupRender();
  vi.clearAllMocks();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  await Events.tests.cleanup();

  // Clear stores
  Databases.Store.clear();
  DatabaseEntryTemplates.Store.clear();
  DatabaseTemplates.Store.clear();
  Designs.Store.clear();
  DesignsNext.Store.clear();
  DataViewTypes.Store.clear();
}
