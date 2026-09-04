import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { I18n, initializeI18n } from '@minddrop/i18n';
import { DesignsStore } from '../DesignsStore';
import { locales } from '../locales';
import { designs, getDesignFiles, ownedDesigns } from './designs.fixtures';

initializeI18n();
I18n.registerTranslations(locales);

export const MockFs = initializeMockFileSystem(getDesignFiles());
export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export interface SetupOptions {
  /**
   * Whether to load the design fixtures into the store.
   */
  loadDesigns?: boolean;
}

export function setup(options: SetupOptions = {}) {
  // Load the design fixtures into the store
  if (options.loadDesigns !== false) {
    DesignsStore.load([...designs, ...ownedDesigns]);
  }

  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
}

export function cleanup() {
  vi.clearAllMocks();
  MockFs.reset();
  DesignsStore.clear();
  Events._clearAll();
  vi.useRealTimers();
}
