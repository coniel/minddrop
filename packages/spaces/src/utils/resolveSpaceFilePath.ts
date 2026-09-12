import { Fs } from '@minddrop/file-system';
import { SpaceFileName } from '../constants';
import { resolveSpaceBundleDirPath } from './resolveSpaceBundleDirPath';

/**
 * Returns the path to a space file inside its bundle directory.
 *
 * @param id - The ID of the space.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the space file.
 */
export function resolveSpaceFilePath(id: string, workspacePath?: string) {
  return Fs.concatPath(
    resolveSpaceBundleDirPath(id, workspacePath),
    SpaceFileName,
  );
}
