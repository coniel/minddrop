import { vi } from 'vitest';
import { cleanupDesignFixtures, setupDesignFixtures } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { ViewTypes, setupViewFixtures } from '@minddrop/views';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntrySerializerSerializersStore } from '../DatabaseEntrySerializersStore';
import { DatabasesStore } from '../DatabasesStore';
import { coreEntrySerializers } from '../entry-serializers';
import {
  databaseEntries,
  databaseEntryFiles,
  databaseEntryPropertyFiles,
  databaseFiles,
  databases,
} from './fixtures';

interface SetupOptions {
  loadDatabases?: boolean;
  loadDatabaseEntries?: boolean;
  loadDatabaseEntrySerializers?: boolean;
}

initializeI18n();

export const MockFs = initializeMockFileSystem([
  ...databaseFiles,
  ...databaseEntryFiles,
  ...databaseEntryPropertyFiles,
]);

export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export function setup(
  options: SetupOptions = {
    loadDatabases: true,
    loadDatabaseEntries: true,
    loadDatabaseEntrySerializers: true,
  },
) {
  // Setup external fixtures
  setupViewFixtures(MockFs);
  setupDesignFixtures(MockFs);

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
    DatabaseEntrySerializerSerializersStore.load(coreEntrySerializers);
  }

  // Mock the current date
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
}

export function cleanup() {
  cleanupDesignFixtures();
  vi.clearAllMocks();
  // Clear stores
  DatabasesStore.clear();
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
