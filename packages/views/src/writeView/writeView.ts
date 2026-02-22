import { Fs } from '@minddrop/file-system';
import { getView } from '../getView';
import { getViewFilePath, getViewsDirPath } from '../utils';

/**
 * Writes a view to the file system.
 * Creates the Views directory if it does not exist.
 *
 * @param id - The ID of the view to write.
 */
export async function writeView(id: string): Promise<void> {
  // Get the view
  const view = getView(id);

  // Ensure that the Views directory exists
  await Fs.ensureDir(getViewsDirPath());

  // Write the view to the file system, omitting the path
  await Fs.writeJsonFile(getViewFilePath(id), view);
}
