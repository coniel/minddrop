import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { getView } from '../getView';
import { getViewFilePath, getViewsDirPath } from '../utils';

/**
 * Writes a view to the file system.
 * Creates the Views directory if it does not exist.
 *
 * @param id - The ID of the view to write.
 *
 * @throws InvalidParameterError if the view is virtual.
 */
export async function writeView(id: string): Promise<void> {
  // Get the view
  const view = getView(id);

  // Virtual views cannot be written to the file system
  if (view.virtual) {
    throw new InvalidParameterError(
      'Cannot write a virtual view to the file system',
    );
  }

  // Ensure that the Views directory exists
  await Fs.ensureDir(getViewsDirPath());

  // Write the view to the file system, omitting the path
  await Fs.writeJsonFile(getViewFilePath(id), view);
}
