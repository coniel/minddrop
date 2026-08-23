import { vi } from 'vitest';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { initializeI18n } from '@minddrop/i18n';

initializeI18n();

export function setup() {
  // Load the databases references resolve against
  Databases.Store.load(DatabaseFixtures.databases);

  // Load the entries offered as references
  DatabaseEntries.Store.load(DatabaseFixtures.databaseEntries);
}

export function cleanup() {
  // Clear stores
  Databases.Store.clear();
  DatabaseEntries.Store.clear();

  Events._clearAll();
  vi.clearAllMocks();
}
