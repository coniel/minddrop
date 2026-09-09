import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import {
  WorkspaceFixtures,
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { initializeWorkspacesFeature } from './initializeWorkspacesFeature';

initializeI18n();
initializeWorkspacesFeature();

// happy-dom does not implement Element.getAnimations, which the
// scroll area primitive polls on a timer.
if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

// The folder used as the workspace location in tests
export const parentDirPath = 'Users/test/Documents';

export const MockFs = initializeMockFileSystem([
  `${parentDirPath}/placeholder.md`,
]);

export { WorkspaceFixtures };

export function setup() {
  // Load the workspaces into the store, the first of which is
  // set as the active workspace.
  setupWorkspaceFixtures(MockFs);
}

export async function cleanup(): Promise<void> {
  cleanupRender();
  vi.clearAllMocks();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  await Events.tests.cleanup();
  cleanupWorkspaceFixtures();
}
