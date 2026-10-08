import { FileSystemChangedEventData, Fs } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
import { loadDesigns } from '../../loadDesigns';
import { readDesign } from '../../readDesign';
import { unloadDesign } from '../../unloadDesign';
import { resolveDesignId } from '../../utils';

/**
 * Applies a change made to a design file outside of the app to its
 * workspace's store record. Ignores changes to any other file.
 *
 * @param change - The file system change.
 */
export async function onFileSystemChanged(
  change: FileSystemChangedEventData,
): Promise<void> {
  // Get the change's workspace
  const workspace = Workspaces.get(change.workspaceId);
  // Get the ID of the design the changed file holds
  const id = resolveDesignId(change.path, workspace.path);

  // Ignore files which are not design files
  if (!id) {
    return;
  }

  // Check if the file is gone, whatever the change's kind. If so,
  // remove the design. An atomic save reports a deleted file which
  // still exists.
  if (!(await Fs.exists(change.path))) {
    unloadDesign(id, workspace.id);

    return;
  }

  // Read the design as it is on disk
  const design = await readDesign(change.path);

  // Leave the store as it is if the existing file is not a valid
  // design. An unreadable file is not a deleted one.
  if (!design) {
    return;
  }

  // Update the store with the design as it is on disk
  loadDesigns([design], workspace.id);
}
