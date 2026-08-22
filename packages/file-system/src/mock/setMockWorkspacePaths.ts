import { Paths } from '@minddrop/utils';

// The path the mock file system's workspace is rooted at, matching the
// workspace the workspaces fixtures describe
export const MockWorkspacePath = 'path/to/workspaces/Workspace 1';

/**
 * Points the workspace paths at the mock file system's workspace.
 *
 * Called when the mock file system is initialized, and directly by
 * fixtures which resolve their paths as they are evaluated, before
 * any mock file system exists.
 */
export function setMockWorkspacePaths(): void {
  Paths.workspace = MockWorkspacePath;
  Paths.workspaceConfigs = `${MockWorkspacePath}/.minddrop`;
}
