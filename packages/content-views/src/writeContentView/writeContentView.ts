import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { getContentView } from '../getContentView';
import { serializeContentView } from '../serializeContentView';
import {
  resolveContentViewFilePath,
  resolveContentViewsDirPath,
} from '../utils';

/**
 * Writes a content view to the file system.
 * Creates the content views directory if it does not exist.
 *
 * @param id - The ID of the content view to write.
 * @param workspaceId - The workspace the content view belongs to. Omit for the active workspace.
 *
 * @throws InvalidParameterError if the content view is virtual.
 */
export async function writeContentView(
  id: string,
  workspaceId?: string,
): Promise<void> {
  // Get the content view
  const view = getContentView(id, true, workspaceId);

  // Virtual content views cannot be written to the file system
  if (view.virtual) {
    throw new InvalidParameterError(
      'Cannot write a virtual view to the file system',
    );
  }

  const workspacePath = Workspaces.resolvePath(workspaceId);

  // Ensure that the content views directory exists
  await Fs.ensureDir(resolveContentViewsDirPath(workspacePath));

  // Write the content view to the file system in its stored form
  await Fs.writeJsonFile(
    resolveContentViewFilePath(id, workspacePath),
    serializeContentView(view, { workspaceId }),
  );
}
