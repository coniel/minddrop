import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import {
  SetupDesignFixturesOptions,
  cleanupDesignFixtures,
  setupDesignFixtures,
} from './setup-design-fixtures';

initializeI18n();

export const MockFs = initializeMockFileSystem();
export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export function setup(options?: SetupDesignFixturesOptions) {
  vi.useFakeTimers({ now: mockDate });
  setupDesignFixtures(MockFs, options);
}

export function cleanup() {
  vi.clearAllMocks();
  vi.useRealTimers();
  MockFs.reset();
  Events._clearAll();
  cleanupDesignFixtures();
}
