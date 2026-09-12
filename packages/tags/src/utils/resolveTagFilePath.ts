import { Fs } from '@minddrop/file-system';
import { TagFileExtension } from '../constants';
import { resolveTagsDirPath } from './resolveTagsDirPath';

/**
 * Returns the path to a tag file.
 *
 * @param id - The ID of the tag.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the tag file.
 */
export function resolveTagFilePath(id: string, workspacePath?: string) {
  return Fs.concatPath(
    resolveTagsDirPath(workspacePath),
    Fs.addFileExtension(id, TagFileExtension),
  );
}
