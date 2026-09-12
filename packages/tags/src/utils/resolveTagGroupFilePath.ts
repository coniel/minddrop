import { Fs } from '@minddrop/file-system';
import { TagFileExtension } from '../constants';
import { resolveTagGroupsDirPath } from './resolveTagGroupsDirPath';

/**
 * Returns the path to a tag group file.
 *
 * @param id - The ID of the tag group.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the tag group file.
 */
export function resolveTagGroupFilePath(id: string, workspacePath?: string) {
  return Fs.concatPath(
    resolveTagGroupsDirPath(workspacePath),
    Fs.addFileExtension(id, TagFileExtension),
  );
}
