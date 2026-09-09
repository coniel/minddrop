// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
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
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import { ItemReferences } from '@minddrop/item-references';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntrySerializersStore } from '../DatabaseEntrySerializersStore';
import { DatabasesStore } from '../DatabasesStore';
import { clearEntryFocusRequest } from '../EntryFocusRequestStore';
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
  // by initializeDatabases.
  ItemReferences.registerAdapter({
    type: 'database-entry',
    serialize: serializeDatabaseEntryReference,
    match: matchDatabaseEntryReference,
  });
  ItemReferences.registerAdapter({
    type: 'database',
    serialize: serializeDatabaseReference,
    match: matchDatabaseReference,
  });

  // Mock the current date
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
}

export async function cleanup(): Promise<void> {
  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

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
  ItemReferences.unregisterAdapter('database-entry');
  ItemReferences.unregisterAdapter('database');

  // Clear the recorded content captures
  clearContentCaptureRegistry();

  // Clear any pending entry focus request
  clearEntryFocusRequest();

  // Vi reset
  vi.useRealTimers();
  vi.clearAllMocks();
}
