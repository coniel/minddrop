import { Fs, InvalidPathError } from '@minddrop/file-system';
import { getView } from '../getView';

/**
 * Writes a view config to the file system.
 *
 * @param viewId - The ID of the view to write.
 * @throws {ViewNotFoundError} If the view does not exist.
 * @throws {InvalidPathError} If the parent directory of the view path does not exist.
 */
export async function writeViewConfig(viewId: string): Promise<void> {
  // Get the view
  const { path, ...rest } = getView(viewId);

  // Ensure the parent directory exists
  if (!(await Fs.exists(Fs.parentDirPath(path)))) {
    throw new InvalidPathError(path);
  }

  // Write the view config to the file system
  Fs.writeJsonFile(path, rest);
}
