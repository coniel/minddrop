import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
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

export async function cleanup(): Promise<void> {
  vi.clearAllMocks();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  DesignsStore.clear();
  await Events.tests.cleanup();
  vi.useRealTimers();
}
