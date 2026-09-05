import { vi } from 'vitest';
import {
  cleanupDesignFixtures,
  setupDesignFixtures,
} from '@minddrop/designs/test-utils';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { I18n, initializeI18n } from '@minddrop/i18n';
import { locales } from '../locales';

initializeI18n();

// Register the feature's own translations, as the feature
// initializer does at runtime, so tests exercise real labels
I18n.registerTranslations(locales);

export const MockFs = initializeMockFileSystem();

export function setup() {
  // Load design fixtures into the stores and mock file system
  setupDesignFixtures(MockFs);
}

export function cleanup() {
  cleanupDesignFixtures();
  Events.tests.cleanup();
  MockFs.reset();
  vi.clearAllMocks();
}
