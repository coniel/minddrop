import { Fs } from '@minddrop/file-system';
import { DesignFileExtension } from '../../constants';
import { resolveDesignsDirPath } from '../resolveDesignsDirPath';

/**
 * Returns the ID of the design stored at the given path, or null if
 * the path is not a design file. Design files are named by their ID.
 *
 * @param path - The path to resolve.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The design ID, or null if the path is not a design file.
 */
export function resolveDesignId(
  path: string,
  workspacePath?: string,
): string | null {
  return Fs.resolveFileIdInDir(
    path,
    resolveDesignsDirPath(workspacePath),
    DesignFileExtension,
  );
}
