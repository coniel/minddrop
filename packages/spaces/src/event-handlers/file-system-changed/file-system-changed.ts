import { FileSystemChangedEventData } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
import { SpacesStore } from '../../SpacesStore';
import { SpaceFileName } from '../../constants';
import { readSpace } from '../../readSpace';
import { parseSpaceBundlePath, resolveSpaceBundleDirPath } from '../../utils';

/**
 * Applies a change made to a space bundle outside of the app to the
 * store record of the workspace the change is in, ignoring changes
 * to any other file.
 *
 * @param change - The file system change.
 */
export async function onFileSystemChanged(
  change: FileSystemChangedEventData,
): Promise<void> {
  const workspace = Workspaces.get(change.workspaceId);
  const parsed = parseSpaceBundlePath(change.path, workspace.path);

  // Not part of a space bundle
  if (!parsed) {
    return;
  }

  const { id, bundlePath } = parsed;
  const store = SpacesStore.in(workspace.id);

  // Only the space file and the bundle directory itself carry
  // state held in the store.
  if (bundlePath !== '' && bundlePath !== SpaceFileName) {
    return;
  }

  // Remove spaces whose bundle or space file is gone
  if (change.kind === 'deleted') {
    store.remove(id);

    return;
  }

  // A change to the bundle directory that is not a deletion says
  // nothing about the space file.
  if (bundlePath === '') {
    return;
  }

  const space = await readSpace(resolveSpaceBundleDirPath(id, workspace.path));

  // The file is missing or is not a valid space
  if (!space) {
    return;
  }

  // Update the store with the space as it is on disk
  store.set(space);
}
