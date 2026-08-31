import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import {
  cleanupTagFixtures,
  setupTagFixtures,
} from '@minddrop/tags/test-utils';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

initializeI18n();

export const MockFs = initializeMockFileSystem();

export function setup() {
  // Load tag fixtures into the stores and mock file system
  setupTagFixtures(MockFs);
}

export function cleanup() {
  cleanupRender();
  cleanupTagFixtures();
  Events._clearAll();
  MockFs.reset();
  vi.clearAllMocks();
}
