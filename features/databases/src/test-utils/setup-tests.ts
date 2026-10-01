// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
import { vi } from 'vitest';
import { ContentViewTypes } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import {
  DatabaseEntries,
  DatabaseEntryTemplates,
  DatabaseTemplates,
  Databases,
} from '@minddrop/databases';
import {
  DatabaseFixtures,
  clearEntryFocusRequest,
} from '@minddrop/databases/test-utils';
import { Designs } from '@minddrop/designs';
import { Designs as DesignsNext } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import { resetPdfStores } from '@minddrop/pdf/test-utils';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import {
  WorkspaceFixtures,
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';

const { workspace_1 } = WorkspaceFixtures;

const { contentViewType_table } = ContentViewFixtures;

interface SetupOptions {
  loadDatabases?: boolean;
  loadDatabaseEntries?: boolean;
  loadDatabaseEntryTemplates?: boolean;
  loadDatabaseTemplates?: boolean;
  loadDesigns?: boolean;
}

initializeI18n();

export const MockFs = initializeMockFileSystem([
  workspace_1.path,
  ...DatabaseFixtures.databaseFiles,
]);

export function setup(
  options: SetupOptions = {
    loadDatabases: true,
    loadDatabaseEntries: true,
    loadDatabaseEntryTemplates: true,
    loadDatabaseTemplates: true,
    loadDesigns: true,
  },
) {
  setupWorkspaceFixtures(MockFs);

  if (options.loadDatabases !== false) {
    // Load item type configs into the store
    Databases.Store.load(DatabaseFixtures.databases);
  }

  if (options.loadDatabaseEntries !== false) {
    // Load entries into the store
    DatabaseEntries.Store.load(DatabaseFixtures.databaseEntries);
  }

  // Load the custom content types into the settings
  Databases.SettingsStore.set('contentDefaults', {
    ...Databases.SettingsStore.get('contentDefaults'),
    customTypes: DatabaseFixtures.customContentTypes,
  });

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
  ContentViewTypes.register(contentViewType_table);
}

/**
 * Loads the pdf database and its entries, and adds their files to the
 * mock file system.
 */
export function setupPdfFixtures(): void {
  Databases.Store.load([DatabaseFixtures.database_pdf]);
  DatabaseEntries.Store.load([
    DatabaseFixtures.databaseEntry_pdf_1,
    DatabaseFixtures.databaseEntry_pdf_2,
  ]);
  MockFs.addFiles([
    ...DatabaseFixtures.databaseFiles_pdf,
    ...DatabaseFixtures.databaseEntryFiles_pdf,
  ]);
}

export async function cleanup(): Promise<void> {
  cleanupRender();
  vi.clearAllMocks();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  await Events.tests.cleanup();

  // Clear any pending focus request, which would otherwise still
  // be pending in the next test.
  clearEntryFocusRequest();

  // Reset the database settings to their built-in values
  Databases.SettingsStore.reset();

  // Clear stores
  Databases.Store.clear();
  DatabaseEntries.Store.clear();
  DatabaseEntryTemplates.Store.clear();
  DatabaseTemplates.Store.clear();
  Designs.Store.clear();
  DesignsNext.Store.clear();
  ContentViewTypes.Store.clear();
  resetPdfStores();
  cleanupWorkspaceFixtures();
}
