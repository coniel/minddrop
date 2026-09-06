import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { getDataView } from '../getDataView';
import { serializeDataView } from '../serializeDataView';
import { resolveViewFilePath, resolveViewsDirPath } from '../utils';

/**
 * Writes a data view to the file system.
 * Creates the data views directory if it does not exist.
 *
 * @param id - The ID of the data view to write.
 *
 * @throws InvalidParameterError if the data view is virtual.
 */
export async function writeDataView(id: string): Promise<void> {
  // Get the data view
  const view = getDataView(id);

  // Virtual data views cannot be written to the file system
  if (view.virtual) {
    throw new InvalidParameterError(
      'Cannot write a virtual view to the file system',
    );
  }

  // Ensure that the data views directory exists
  await Fs.ensureDir(resolveViewsDirPath());

  // Write the data view to the file system in its stored form
  await Fs.writeJsonFile(resolveViewFilePath(id), serializeDataView(view));
}
