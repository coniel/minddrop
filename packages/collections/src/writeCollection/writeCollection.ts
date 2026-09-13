import { Fs } from '@minddrop/file-system';
import { ItemReferences } from '@minddrop/item-references';
import { InvalidParameterError } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { getCollection } from '../getCollection';
import { resolveCollectionFilePath, resolveCollectionsDirPath } from '../utils';

/**
 * Writes a collection to the file system.
 *
 * @param id - The ID of the collection to write.
 * @param workspaceId - The workspace the collection belongs to. Omit for the active workspace.
 *
 * @throws InvalidParameterError if the collection is virtual.
 */
export async function writeCollection(
  id: string,
  workspaceId?: string,
): Promise<void> {
  // Get the collection
  const collection = getCollection(id, true, workspaceId);

  // Virtual collections cannot be written to the file system
  if (collection.virtual) {
    throw new InvalidParameterError(
      'Cannot write a virtual collection to the file system',
    );
  }

  const workspacePath = Workspaces.resolvePath(workspaceId);

  // Ensure the collections directory exists
  await Fs.ensureDir(resolveCollectionsDirPath(workspacePath));

  // Convert the member item IDs into durable references
  const items = ItemReferences.serialize(collection.items, workspaceId);

  // Write the collection config
  Fs.writeJsonFile(resolveCollectionFilePath(id, workspacePath), {
    ...collection,
    items,
  });
}
