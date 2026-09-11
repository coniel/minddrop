import { BaseDirectory, Fs } from '@minddrop/file-system';
import { WorkspacesDataDirName } from '../../constants';

/**
 * Returns the path of the directory holding a workspace's per-device
 * state inside the app data directory.
 *
 * The directory is keyed by workspace ID rather than path, so that
 * moving or renaming a workspace directory keeps its state.
 *
 * @param workspaceId - The workspace whose data directory to resolve.
 * @returns The path of the workspace's data directory.
 */
export function resolveWorkspaceDataDirPath(workspaceId: string): string {
  return Fs.concatPath(
    Fs.resolveBaseDirPath(BaseDirectory.AppData),
    WorkspacesDataDirName,
    workspaceId,
  );
}
