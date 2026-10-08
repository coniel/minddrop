// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
import { vi } from 'vitest';
import { Collections } from '@minddrop/collections';
import {
  cleanupContentViewFixtures,
  setupContentViewFixtures,
} from '@minddrop/content-views/test-utils';
import { Designs } from '@minddrop/designs-next';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { Filters } from '@minddrop/filters';
import { I18n, initializeI18n } from '@minddrop/i18n';
import { ItemReferences } from '@minddrop/item-references';
import { Properties } from '@minddrop/properties';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { DatabaseSettingsStore } from '../DatabaseSettingsStore';
import { DatabasesStore } from '../DatabasesStore';
import { EntriesStore } from '../EntriesStore';
import { clearEntryFocusRequest } from '../EntryFocusRequestStore';
import { EntrySerializersRegistry } from '../EntrySerializersRegistry';
import { DatabaseEntityType, EntryEntityType } from '../constants';
import { clearContentCaptureRegistry } from '../contentCaptureRegistry';
import { locales } from '../locales';
import { registerEntryFilterAdapter } from '../registerEntryFilterAdapter';
import {
  matchDatabaseReference,
  matchEntryReference,
  serializeDatabaseReference,
  serializeEntryReference,
} from '../utils';
import { customContentTypes } from './fixtures';
import { resetFileSystemChangedSyncs } from './resetFileSystemChangedSyncs';
import {
  SetupDatabaseFixturesOptions,
  cleanupDatabaseFixtures,
  setupDatabaseFixtures,
} from './setup-fixtures';

initializeI18n();

// Register the package's translations and the property type names
// the metadata properties are named with.
I18n.registerTranslations(locales);
Properties.initialize();

export const MockFs = initializeMockFileSystem();

export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export function setup(options?: SetupDatabaseFixturesOptions) {
  // Set up the workspace fixtures first, so that the workspace
  // scoped stores load into the active workspace's record.
  setupWorkspaceFixtures(MockFs);
  // Setup database fixtures
  setupDatabaseFixtures(MockFs, options);
  // Load the custom content types into the settings
  DatabaseSettingsStore.set('contentDefaults', {
    ...DatabaseSettingsStore.get('contentDefaults'),
    customTypes: customContentTypes,
  });
  // Setup external fixtures
  setupContentViewFixtures(MockFs);

  // Register the item reference adapters registered at runtime
  // by initializeDatabases.
  ItemReferences.registerAdapter({
    type: EntryEntityType,
    serialize: serializeEntryReference,
    match: matchEntryReference,
  });
  ItemReferences.registerAdapter({
    type: DatabaseEntityType,
    serialize: serializeDatabaseReference,
    match: matchDatabaseReference,
  });

  // Register the entry filter adapter, as initializeDatabases does
  registerEntryFilterAdapter();

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

  // Reset the settings to their built-in values, while the workspace
  // they were written under is still active.
  DatabaseSettingsStore.reset();

  // Clear database fixtures
  cleanupDatabaseFixtures();
  // Clear external fixtures
  cleanupContentViewFixtures();
  cleanupWorkspaceFixtures();
  Designs.Store.clear();

  // Clear stores
  DatabasesStore.clear();
  EntriesStore.clear();
  EntrySerializersRegistry.clear();
  Collections.Store.clear();

  Filters.unregisterAdapter('database-entry');

  // Unregister the item reference adapters
  ItemReferences.unregisterAdapter('database-entry');
  ItemReferences.unregisterAdapter('database');

  // Clear the recorded content captures
  clearContentCaptureRegistry();

  // Clear any pending entry focus request
  clearEntryFocusRequest();

  // Clear the file system changed handler's pending and running syncs
  resetFileSystemChangedSyncs();

  // Vi reset
  vi.useRealTimers();
  vi.clearAllMocks();
}
