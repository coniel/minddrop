import { vi } from 'vitest';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { initializeI18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { PaneEditorsStore } from '../PaneEditorsStore';

// Initialize i18n
initializeI18n();

export function setup() {
  // Load the databases references resolve against
  Databases.Store.load(DatabaseFixtures.databases);

  // Load the entries offered as references
  DatabaseEntries.Store.load(DatabaseFixtures.databaseEntries);
}

/**
 * Clears the stores, listeners and mocks.
 */
export function cleanup() {
  // Unmount rendered components
  cleanupRender();

  // Clear stores
  Databases.Store.clear();
  DatabaseEntries.Store.clear();
  PaneEditorsStore.setState({ panes: {} });

  // Remove listeners and reset mocks
  Events.tests.cleanup();
  vi.clearAllMocks();
}
