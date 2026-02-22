import { vi } from 'vitest';
import { cleanupDesignFixtures, setupDesignFixtures } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { cleanupViewFixtures, setupViewFixtures } from '@minddrop/views';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntrySerializersStore } from '../DatabaseEntrySerializersStore';
import { DatabasesStore } from '../DatabasesStore';
import {
  SetupDatabaseFixturesOptions,
  cleanupDatabaseFixtures,
  setupDatabaseFixtures,
} from './setup-fixtures';

initializeI18n();

export const MockFs = initializeMockFileSystem();

export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export function setup(options: SetupDatabaseFixturesOptions) {
  // Setup database fixtures
  setupDatabaseFixtures(MockFs, options);
  // Setup external fixtures
  setupViewFixtures(MockFs);
  setupDesignFixtures(MockFs);
  setupWorkspaceFixtures(MockFs);

  // Mock the current date
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
}

export function cleanup() {
  // Clear database fixtures
  cleanupDatabaseFixtures();
  // Clear external fixtures
  cleanupDesignFixtures();
  cleanupViewFixtures();
  cleanupWorkspaceFixtures();

  // Clear stores
  DatabasesStore.clear();
  DatabaseEntriesStore.clear();
  DatabaseEntrySerializersStore.clear();

  // Reset mock file system
  MockFs.reset();

  // Clear all event listeners
  Events._clearAll();

  // Vi reset
  vi.useRealTimers();
  vi.clearAllMocks();
}
