import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { EntityGroupsDirName } from '../constants';

/**
 * Returns the path to a group type's file within the workspace.
 *
 * @param type - The group type.
 * @returns The path to the type's groups file.
 */
export function resolveEntityGroupsFilePath(type: string): string {
  return Fs.concatPath(
    Paths.workspaceConfigs,
    EntityGroupsDirName,
    `${type}.json`,
  );
}
