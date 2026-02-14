import { vi } from 'vitest';
import {
  DatabaseEntries,
  DatabaseFixtures,
  Databases,
} from '@minddrop/databases';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

export function setup() {
  // Load databases into the store
  Databases.Store.load(DatabaseFixtures.databases);
  // Load database entries into the store
  DatabaseEntries.Store.load(DatabaseFixtures.databaseEntries);
}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();

  // Clear stores
  Databases.Store.clear();
  DatabaseEntries.Store.clear();
}
