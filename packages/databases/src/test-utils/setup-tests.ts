import { vi } from 'vitest';
import { Collections } from '@minddrop/collections';
import {
  cleanupDataViewFixtures,
  setupDataViewFixtures,
} from '@minddrop/data-views/test-utils';
import {
  cleanupDesignFixtures,
  setupDesignFixtures,
} from '@minddrop/designs-legacy/test-utils';
import { Events } from '@minddrop/events';
import {
  initializeMockFileSystem,
  setMockWorkspacePaths,
} from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import {
  registerItemReferenceAdapter,
  unregisterItemReferenceAdapter,
} from '@minddrop/item-references';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntrySerializersStore } from '../DatabaseEntrySerializersStore';
import { DatabasesStore } from '../DatabasesStore';
import {
  matchDatabaseEntryReference,
  matchDatabaseReference,
  serializeDatabaseEntryReference,
  serializeDatabaseReference,
} from '../utils';
import {
  SetupDatabaseFixturesOptions,
  cleanupDatabaseFixtures,
  setupDatabaseFixtures,
} from './setup-fixtures';

initializeI18n();

// The fixture file paths resolve against the mock workspace, so it is
// set before they are read
setMockWorkspacePaths();

export const MockFs = initializeMockFileSystem();

export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export function setup(options?: SetupDatabaseFixturesOptions) {
  // Setup database fixtures
  setupDatabaseFixtures(MockFs, options);
  // Setup external fixtures
  setupDataViewFixtures(MockFs);
  setupDesignFixtures(MockFs);
  setupWorkspaceFixtures(MockFs);

  // Register the item reference adapters registered at runtime
  // by initializeDatabases
  registerItemReferenceAdapter({
    type: 'database-entry',
    serialize: serializeDatabaseEntryReference,
    match: matchDatabaseEntryReference,
  });
  registerItemReferenceAdapter({
    type: 'database',
    serialize: serializeDatabaseReference,
    match: matchDatabaseReference,
  });

  // Mock the current date
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
}

export function cleanup() {
  // Clear database fixtures
  cleanupDatabaseFixtures();
  // Clear external fixtures
  cleanupDesignFixtures();
  cleanupDataViewFixtures();
  cleanupWorkspaceFixtures();

  // Clear stores
  DatabasesStore.clear();
  DatabaseEntriesStore.clear();
  DatabaseEntrySerializersStore.clear();
  Collections.Store.clear();

  // Unregister the item reference adapters
  unregisterItemReferenceAdapter('database-entry');
  unregisterItemReferenceAdapter('database');

  // Reset mock file system
  MockFs.reset();

  // Clear all event listeners
  Events._clearAll();

  // Vi reset
  vi.useRealTimers();
  vi.clearAllMocks();
}
