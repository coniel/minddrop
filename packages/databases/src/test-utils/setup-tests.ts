import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { ViewFixtures, ViewTypes } from '@minddrop/views';
import { DataTypesStore } from '../DataTypesStore';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntrySerializerSerializersStore } from '../DatabaseEntrySerializersStore';
import { DatabasesStore } from '../DatabasesStore';
import { coreDataTypes } from '../data-type-configs';
import { coreEntrySerializers } from '../entry-serializers';
import {
  dataTypes,
  databaseEntries,
  databaseEntryFiles,
  databaseFiles,
  databases,
} from './fixtures';

const { viewType1 } = ViewFixtures;

interface SetupOptions {
  loadDatabases?: boolean;
  loadDataTypes?: boolean;
  loadDatabaseEntries?: boolean;
  loadDatabaseEntrySerializers?: boolean;
}

initializeI18n();

export const MockFs = initializeMockFileSystem([
  ...databaseFiles,
  ...databaseEntryFiles,
]);

export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export function setup(
  options: SetupOptions = {
    loadDatabases: true,
    loadDataTypes: true,
    loadDatabaseEntries: true,
    loadDatabaseEntrySerializers: true,
  },
) {
  // Regiaster a test view type
  ViewTypes.register(viewType1);

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

  // Mock the current date
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
}

export function cleanup() {
  vi.clearAllMocks();
  // Clear stores
  DatabasesStore.clear();
  DataTypesStore.clear();
  DatabaseEntriesStore.clear();
  DatabaseEntrySerializerSerializersStore.clear();
  ViewTypes.Store.clear();
  // Reset mock file system
  MockFs.reset();
  // Clear all event listeners
  Events._clearAll();

  // Reset the current date
  vi.useRealTimers();
}
