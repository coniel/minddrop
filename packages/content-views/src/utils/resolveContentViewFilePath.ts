import { Fs } from '@minddrop/file-system';
import { ContentViewFileExtension } from '../constants';
import { resolveContentViewsDirPath } from './resolveContentViewsDirPath';

/**
 * Returns the path to a content view file.
 *
 * @param id - The ID of the content view.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the content view file.
 */
export function resolveContentViewFilePath(
  id: string,
  workspacePath?: string,
): string {
  return Fs.concatPath(
    resolveContentViewsDirPath(workspacePath),
    Fs.addFileExtension(id, ContentViewFileExtension),
  );
}
