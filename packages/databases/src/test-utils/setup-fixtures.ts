import { MockFileSystem } from '@minddrop/file-system';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntrySerializersStore } from '../DatabaseEntrySerializersStore';
import { DatabasesStore } from '../DatabasesStore';
import { coreEntrySerializers } from '../entry-serializers';
import {
  databaseEntries,
  databaseEntryFiles,
  databaseEntryPropertyFiles,
  databaseEntryTemplateFiles,
  databaseFiles,
  databases,
} from './fixtures';

export interface SetupDatabaseFixturesOptions {
  loadDatabases?: boolean;
  loadDatabaseFiles?: boolean;
  loadDatabaseEntries?: boolean;
  loadDatabaseEntryFiles?: boolean;
  loadDatabaseEntryPropertyFiles?: boolean;
  loadDatabaseEntryTemplateFiles?: boolean;
  loadDatabaseEntrySerializers?: boolean;
}

export function setupDatabaseFixtures(
  MockFs: MockFileSystem,
  options: SetupDatabaseFixturesOptions = {
    loadDatabases: true,
    loadDatabaseFiles: true,
    loadDatabaseEntries: true,
    loadDatabaseEntryFiles: true,
    loadDatabaseEntryPropertyFiles: true,
    loadDatabaseEntrySerializers: true,
  },
) {
  if (options.loadDatabases !== false) {
    // Load item type configs into the store
    DatabasesStore.load(databases);
  }

  if (options.loadDatabaseEntries !== false) {
    // Load database entries into the store
    DatabaseEntriesStore.load(databaseEntries);
  }

  if (options.loadDatabaseEntrySerializers !== false) {
    // Load database entry serializers into the store
    DatabaseEntrySerializersStore.load(coreEntrySerializers);
  }

  if (options.loadDatabaseEntryFiles !== false) {
    // Add database entry files to the file system
    MockFs.addFiles(databaseEntryFiles);
  }

  if (options.loadDatabaseEntryPropertyFiles !== false) {
    // Add database entry property files to the file system
    MockFs.addFiles(databaseEntryPropertyFiles);
  }

  if (options.loadDatabaseEntryTemplateFiles !== false) {
    // Add database entry template files to the file system
    MockFs.addFiles(databaseEntryTemplateFiles);
  }

  if (options.loadDatabaseFiles !== false) {
    // Add database files to the file system
    MockFs.addFiles(databaseFiles);
  }
}

export function cleanupDatabaseFixtures() {
  // Clear stores
  DatabasesStore.clear();
  DatabaseEntriesStore.clear();
  DatabaseEntrySerializersStore.clear();
}
