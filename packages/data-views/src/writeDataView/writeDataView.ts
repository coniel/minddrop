import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { getDataView } from '../getDataView';
import { serializeDataView } from '../serializeDataView';
import { resolveViewFilePath, resolveViewsDirPath } from '../utils';

/**
 * Writes a data view to the file system.
 * Creates the data views directory if it does not exist.
 *
 * @param id - The ID of the data view to write.
 * @param workspaceId - The workspace the data view belongs to. Omit for the active workspace.
 *
 * @throws InvalidParameterError if the data view is virtual.
 */
export async function writeDataView(
  id: string,
  workspaceId?: string,
): Promise<void> {
  // Get the data view
  const view = getDataView(id, true, workspaceId);

  // Virtual data views cannot be written to the file system
  if (view.virtual) {
    throw new InvalidParameterError(
      'Cannot write a virtual view to the file system',
    );
  }

  const workspacePath = Workspaces.resolvePath(workspaceId);

  // Ensure that the data views directory exists
  await Fs.ensureDir(resolveViewsDirPath(workspacePath));

  // Write the data view to the file system in its stored form
  await Fs.writeJsonFile(
    resolveViewFilePath(id, workspacePath),
    serializeDataView(view, { workspaceId }),
  );
}
