import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { Paths } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { designFiles, designs, designsRootPath } from './fixtures';

interface SetupOptions {
  loadDesigns?: boolean;
  loadDesignFiles?: boolean;
}

initializeI18n();

export const MockFs = initializeMockFileSystem([designsRootPath]);

export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export function setup(
  options: SetupOptions = {
    loadDesigns: true,
    loadDesignFiles: true,
  },
) {
  // Set the designs root path
  Paths.designs = designsRootPath;
  // Mock the current date
  vi.useFakeTimers({ now: mockDate });

  if (options.loadDesigns !== false) {
    // Load view types into the store
    DesignsStore.load(designs);
  }

  if (options.loadDesignFiles !== false) {
    // Add design file to the file system
    MockFs.addFiles(designFiles);
  }
}

export function cleanup() {
  vi.clearAllMocks();
  vi.useRealTimers();
  // Clear stores
  DesignsStore.clear();
  // Reset mock file system
  MockFs.reset();
  // Clear all event listeners
  Events._clearAll();
}
