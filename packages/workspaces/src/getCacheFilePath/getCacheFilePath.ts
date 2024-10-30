import { Fs } from '@minddrop/file-system';
import { WorkspaceCacheDirName, WorkspaceConfigDirName } from '../constants';

/**
 * Returns the path to a cache file.
 *
 * @param workspacePath - The path to the workspace directory.
 * @param resourceId - The ID of the resource (e.g. node) that the file belongs to.
 * @param fileName - The name of the file.
 * @returns The path to the cached file or null if it does not exist.
 */
export function getCacheFilePath(
  workspacePath: string,
  resourceId: string,
  fileName: string,
): string {
  return Fs.concatPath(
    workspacePath,
    WorkspaceConfigDirName,
    WorkspaceCacheDirName,
    resourceId,
    fileName,
  );
}
