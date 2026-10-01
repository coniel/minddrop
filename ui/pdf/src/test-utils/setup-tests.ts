// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
import { vi } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { PdfAnnotations } from '@minddrop/pdf';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';

// The mock file system the workspace fixtures are set up on
export const MockFs = initializeMockFileSystem();

/**
 * Sets up the workspace fixtures.
 */
export function setup() {
  setupWorkspaceFixtures(MockFs);
}

/**
 * Cleans up rendered components, mocks and stores.
 */
export function cleanup() {
  // Unmount rendered components and reset mocks
  cleanupRender();
  vi.clearAllMocks();

  // Clear the stores
  PdfAnnotations.Store.clear();
  cleanupWorkspaceFixtures();
}
