import { Fs } from '@minddrop/file-system';
import { ContentViewFileExtension } from '../../constants';
import { resolveContentViewsDirPath } from '../resolveContentViewsDirPath';

/**
 * Returns the ID of the content view stored at the given path, or null
 * if the path is not a content view file. View files are named by their
 * ID.
 *
 * @param path - The path to resolve.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The content view ID or null if the path is not a view file.
 */
export function resolveContentViewId(
  path: string,
  workspacePath?: string,
): string | null {
  const parentDirPath = Fs.parentDirPath(path);

  // View files sit directly in the workspace's content views directory
  if (parentDirPath !== resolveContentViewsDirPath(workspacePath)) {
    return null;
  }

  const fileName = Fs.fileNameFromPath(path);

  // Ignore other files that may end up in the directory
  if (Fs.getExtension(fileName) !== ContentViewFileExtension) {
    return null;
  }

  return Fs.removeExtension(fileName);
}
