import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import {
  initializeMockFileSystem,
  setMockWorkspacePaths,
} from '@minddrop/file-system/test-utils';
import {
  SetupWorkspaceFixturesOptions,
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from './setup-fixtures';

// The fixture file paths resolve against the mock workspace, so it is
// set before they are read
setMockWorkspacePaths();

export const MockFs = initializeMockFileSystem();
export const mockDate = new Date('2000-01-01T00:00:00.000Z');

export function setup(options?: SetupWorkspaceFixturesOptions) {
  vi.useFakeTimers({ now: mockDate });
  setupWorkspaceFixtures(MockFs, options);
}

export function cleanup() {
  vi.clearAllMocks();
  vi.useRealTimers();
  MockFs.reset();
  Events._clearAll();
  cleanupWorkspaceFixtures();
}
