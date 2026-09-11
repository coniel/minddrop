import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { getWorkspace } from '../../getWorkspace';

/**
 * Returns the path of the hidden directory inside a workspace holding
 * its configuration and the state which syncs along with it.
 *
 * @param workspaceId - The workspace whose config directory to resolve.
 * @returns The path of the workspace's config directory.
 *
 * @throws {WorkspaceNotFoundError} If the workspace does not exist.
 */
export function resolveWorkspaceConfigDirPath(workspaceId: string): string {
  return Fs.concatPath(getWorkspace(workspaceId).path, Paths.hiddenDirName);
}
