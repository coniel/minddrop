import { vi } from 'vitest';
import { Collections } from '@minddrop/collections';
import {
  cleanupDataViewFixtures,
  setupDataViewFixtures,
} from '@minddrop/data-views/test-utils';
import { Designs as DesignsNext } from '@minddrop/designs-next';
import {
  cleanupDesignFixtures,
  setupDesignFixtures,
} from '@minddrop/designs/test-utils';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
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
import { clearContentCaptureRegistry } from '../contentCaptureRegistry';
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

export async function cleanup() {
  // Clean up events
  await Events.tests.cleanup();

  // Clear database fixtures
  cleanupDatabaseFixtures();
  // Clear external fixtures
  cleanupDesignFixtures();
  cleanupDataViewFixtures();
  cleanupWorkspaceFixtures();
  DesignsNext.Store.clear();

  // Clear stores
  DatabasesStore.clear();
  DatabaseEntriesStore.clear();
  DatabaseEntrySerializersStore.clear();
  Collections.Store.clear();

  // Unregister the item reference adapters
  unregisterItemReferenceAdapter('database-entry');
  unregisterItemReferenceAdapter('database');

  // Clear the recorded content captures
  clearContentCaptureRegistry();

  // Reset mock file system
  MockFs.reset();

  // Vi reset
  vi.useRealTimers();
  vi.clearAllMocks();
}
