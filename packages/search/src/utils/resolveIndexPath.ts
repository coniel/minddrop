import { Fs } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
import { SearchIndexFileName } from '../constants';

/**
 * Returns the path of a workspace's persisted MiniSearch index
 * file, located inside the workspace's data directory.
 *
 * @param workspaceId - The workspace whose index path to resolve.
 * @returns The path of the workspace's index file.
 */
export function resolveIndexPath(workspaceId: string): string {
  return Fs.concatPath(
    Workspaces.resolveDataDirPath(workspaceId),
    SearchIndexFileName,
  );
}
