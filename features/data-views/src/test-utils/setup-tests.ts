import { vi } from 'vitest';
import {
  cleanupDataViewFixtures,
  setupDataViewFixtures,
} from '@minddrop/data-views/test-utils';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';

initializeI18n();

export const MockFs = initializeMockFileSystem();

export function setup() {
  // Load workspace fixtures required for view file path resolution
  setupWorkspaceFixtures(MockFs);

  // Load data view fixtures into the store and mock file system
  setupDataViewFixtures(MockFs);
}

export function cleanup() {
  cleanupDataViewFixtures();
  cleanupWorkspaceFixtures();
  Events.tests.cleanup();
  MockFs.reset();
  vi.clearAllMocks();
}
