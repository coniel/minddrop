import { vi } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases';
import { cleanupDesignFixtures, setupDesignFixtures } from '@minddrop/designs';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

const MockFs = initializeMockFileSystem();

export function setup() {
  // Load database and entry fixtures into the stores
  DatabaseFixtures.setup(MockFs, {
    loadDatabases: true,
    loadDatabaseEntries: true,
    loadDatabaseFiles: false,
    loadDatabaseEntryFiles: false,
    loadDatabaseEntryPropertyFiles: false,
    loadDatabaseEntrySerializers: false,
  });

  // Load design fixtures into the store
  setupDesignFixtures(MockFs, {
    loadDesigns: true,
    loadDesignFiles: false,
  });
}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
  DatabaseFixtures.cleanup();
  cleanupDesignFixtures();
  MockFs.reset();
}
