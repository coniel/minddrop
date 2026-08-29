import { BaseDirectory, Fs } from '@minddrop/file-system';

/**
 * Returns the path of a workspace's persisted MiniSearch index
 * file, located inside the app config directory.
 *
 * @param workspaceId - The workspace whose index path to resolve.
 * @returns The path of the workspace's index file.
 */
export function resolveIndexPath(workspaceId: string): string {
  return `${Fs.getBaseDirPath(BaseDirectory.AppConfig)}/${workspaceId}/search-index.json`;
}
