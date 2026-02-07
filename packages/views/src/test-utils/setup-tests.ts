import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { ViewsStore } from '../ViewsStore';
import { viewFiles, views, viewsBasePath } from './fixtures';

interface SetupOptions {
  loadViews?: boolean;
  loadViewFiles?: boolean;
}

initializeI18n();

export const MockFs = initializeMockFileSystem([...viewFiles]);

export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export function setup(
  options: SetupOptions = {
    loadViews: true,
    loadViewFiles: true,
  },
) {
  if (options.loadViews !== false) {
    // Load item type configs into the store
    ViewsStore.load(views);
  }

  if (options.loadViewFiles === false) {
    // Clear the file system
    MockFs.clear();
    // Add the base path back
    MockFs.addFiles([viewsBasePath]);
  }

  // Mock the current date
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
}

export function cleanup() {
  vi.clearAllMocks();
  // Clear stores
  ViewsStore.clear();
  // Reset mock file system
  MockFs.reset();
  // Clear all event listeners
  Events._clearAll();
  // Reset the current date
  vi.useRealTimers();
}
