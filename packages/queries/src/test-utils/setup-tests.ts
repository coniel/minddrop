import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { QueriesStore } from '../QueriesStore';
import { queries, queriesBasePath, queryFiles } from './fixtures';

interface SetupOptions {
  loadQueries?: boolean;
  loadQueryFiles?: boolean;
}

initializeI18n();

export const MockFs = initializeMockFileSystem([...queryFiles]);

export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export function setup(
  options: SetupOptions = {
    loadQueries: true,
    loadQueryFiles: true,
  },
) {
  if (options.loadQueries !== false) {
    // Load item type configs into the store
    QueriesStore.load(queries);
  }

  if (options.loadQueryFiles === false) {
    // Clear the file system
    MockFs.clear();
    // Add the base path back
    MockFs.addFiles([queriesBasePath]);
  }

  // Mock the current date
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
}

export function cleanup() {
  vi.clearAllMocks();
  // Clear stores
  QueriesStore.clear();
  // Reset mock file system
  MockFs.reset();
  // Clear all event listeners
  Events._clearAll();
  // Reset the current date
  vi.useRealTimers();
}
