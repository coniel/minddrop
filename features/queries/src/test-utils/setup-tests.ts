import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { I18n, initializeI18n } from '@minddrop/i18n';
import {
  cleanupQueryFixtures,
  setupQueryFixtures,
} from '@minddrop/queries/test-utils';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { locales } from '../locales';

initializeI18n();

// Register the feature's translations so labels resolve
I18n.registerTranslations(locales);

export const MockFs = initializeMockFileSystem();

export function setup() {
  // Load query fixtures into the store and mock file system
  setupQueryFixtures(MockFs);
}

export function cleanup() {
  cleanupRender();
  cleanupQueryFixtures();
  Events._clearAll();
  MockFs.reset();
  vi.clearAllMocks();
}
