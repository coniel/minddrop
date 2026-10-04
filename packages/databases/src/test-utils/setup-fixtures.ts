import { MockFileSystem } from '@minddrop/file-system';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { DatabasesStore } from '../DatabasesStore';
import { EntriesStore } from '../EntriesStore';
import { EntrySerializersRegistry } from '../EntrySerializersRegistry';
import { coreEntrySerializers } from '../entry-serializers';
import {
  databaseEntryTemplateFiles,
  databaseEntryTemplates,
  databaseFiles,
  databases,
  entries,
  entryFiles,
  entryPropertyFiles,
} from './fixtures';

export interface SetupDatabaseFixturesOptions {
  loadDatabases?: boolean;
  loadDatabaseFiles?: boolean;
  loadEntries?: boolean;
  loadEntryFiles?: boolean;
  loadEntryPropertyFiles?: boolean;
  loadDatabaseEntryTemplates?: boolean;
  loadDatabaseEntryTemplateFiles?: boolean;
  loadEntrySerializers?: boolean;
}

export function setupDatabaseFixtures(
  MockFs: MockFileSystem,
  options: SetupDatabaseFixturesOptions = {
    loadDatabases: true,
    loadDatabaseFiles: true,
    loadEntries: true,
    loadEntryFiles: true,
    loadEntryPropertyFiles: true,
    loadEntrySerializers: true,
  },
) {
  if (options.loadDatabases !== false) {
    // Load item type configs into the store
    DatabasesStore.load(databases);
  }

  if (options.loadEntries !== false) {
    // Load database entries into the store
    EntriesStore.load(entries);
  }

  if (options.loadDatabaseEntryTemplates !== false) {
    // Load database entry templates into the store
    DatabaseEntryTemplatesStore.load(databaseEntryTemplates);
  }

  if (options.loadEntrySerializers !== false) {
    // Load database entry serializers into the store
    EntrySerializersRegistry.store.load(coreEntrySerializers);
  }

  if (options.loadEntryFiles !== false) {
    // Add database entry files to the file system
    MockFs.addFiles(entryFiles);
  }

  if (options.loadEntryPropertyFiles !== false) {
    // Add database entry property files to the file system
    MockFs.addFiles(entryPropertyFiles);
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
  EntriesStore.clear();
  DatabaseEntryTemplatesStore.clear();
  EntrySerializersRegistry.clear();
}
