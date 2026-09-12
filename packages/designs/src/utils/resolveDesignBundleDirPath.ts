import { Fs } from '@minddrop/file-system';
import { resolveDesignsDirPath } from './resolveDesignsDirPath';

/**
 * Returns the path to a design's bundle directory, which contains
 * the design file along with the design's media files.
 *
 * @param id - The ID of the design.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the design bundle directory.
 */
export function resolveDesignBundleDirPath(
  id: string,
  workspacePath?: string,
): string {
  return Fs.concatPath(resolveDesignsDirPath(workspacePath), id);
}
