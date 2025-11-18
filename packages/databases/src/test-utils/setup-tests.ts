import { vi } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { DataTypesStore } from '../DataTypesStore';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntrySerializerSerializersStore } from '../DatabaseEntrySerializersStore';
import { DatabasesStore } from '../DatabasesStore';
import { coreDataTypes } from '../data-type-configs';
import { coreEntrySerializers } from '../entry-serializers';
import {
  dataTypes,
  databaseEntries,
  databaseFiles,
  databases,
} from './fixtures';

interface SetupOptions {
  loadDatabases?: boolean;
  loadDataTypes?: boolean;
  loadDatabaseEntries?: boolean;
  loadDatabaseEntrySerializers?: boolean;
}

initializeI18n();

export const MockFs = initializeMockFileSystem(databaseFiles);

export function setup(
  options: SetupOptions = {
    loadDatabases: true,
    loadDataTypes: true,
    loadDatabaseEntries: true,
    loadDatabaseEntrySerializers: true,
  },
) {
  if (options.loadDatabases !== false) {
    // Load item type configs into the store
    DatabasesStore.load(databases);
  }

  if (options.loadDataTypes !== false) {
    // Load data types into the store
    DataTypesStore.load([...coreDataTypes, ...dataTypes]);
  }

  if (options.loadDatabaseEntries !== false) {
    // Load database entries into the store
    DatabaseEntriesStore.load(databaseEntries);
  }

  if (options.loadDatabaseEntrySerializers !== false) {
    // Load database entry serializers into the store
    DatabaseEntrySerializerSerializersStore.load(coreEntrySerializers);
  }
}

export function cleanup() {
  vi.clearAllMocks();
  // Clear stores
  DatabasesStore.clear();
  DataTypesStore.clear();
  DatabaseEntriesStore.clear();
  DatabaseEntrySerializerSerializersStore.clear();
  // Reset mock file system
  MockFs.reset();
}
