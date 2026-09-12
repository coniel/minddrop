import { Fs } from '@minddrop/file-system';
import { resolveEntityGroupsDirPath } from './resolveEntityGroupsDirPath';

/**
 * Returns the path to a group type's file within a workspace.
 *
 * @param type - The group type.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the type's groups file.
 */
export function resolveEntityGroupsFilePath(
  type: string,
  workspacePath?: string,
): string {
  return Fs.concatPath(
    resolveEntityGroupsDirPath(workspacePath),
    `${type}.json`,
  );
}
