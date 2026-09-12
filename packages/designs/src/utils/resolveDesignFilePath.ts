import { Fs } from '@minddrop/file-system';
import { DesignFileName } from '../constants';
import { resolveDesignBundleDirPath } from './resolveDesignBundleDirPath';

/**
 * Returns the path to a design file inside its bundle directory.
 *
 * @param id - The ID of the design.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the design file.
 */
export function resolveDesignFilePath(
  id: string,
  workspacePath?: string,
): string {
  return Fs.concatPath(
    resolveDesignBundleDirPath(id, workspacePath),
    DesignFileName,
  );
}
