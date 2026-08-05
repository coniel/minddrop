import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces';
import {
  SetupDataViewFixturesOptions,
  cleanupDataViewFixtures,
  setupDataViewFixtures,
} from './setup-fixtures';

export const MockFs = initializeMockFileSystem();
export const mockDate = new Date('2000-01-01T00:00:00.000Z');

export function setup(options: SetupDataViewFixturesOptions) {
  setupWorkspaceFixtures(MockFs);
  setupDataViewFixtures(MockFs, options);
  vi.useFakeTimers({ now: mockDate });
}

export function cleanup() {
  cleanupDataViewFixtures();
  cleanupWorkspaceFixtures();
  Events._clearAll();
  MockFs.reset();
  vi.clearAllMocks();
  vi.useRealTimers();
}
