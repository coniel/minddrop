import { FileSystemChangedEventData } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
import { DesignsStore } from '../../DesignsStore';
import { DesignFileName } from '../../constants';
import { readDesign } from '../../readDesign';
import { parseDesignBundlePath, resolveDesignBundleDirPath } from '../../utils';

/**
 * Applies a change made to a design bundle outside of the app to
 * the store record of the workspace the change is in, ignoring
 * changes to any other file.
 *
 * Media files are not covered: they are served from disk at render
 * time, so nothing in the store holds their contents.
 *
 * @param change - The file system change.
 */
export async function onFileSystemChanged(
  change: FileSystemChangedEventData,
): Promise<void> {
  const workspace = Workspaces.get(change.workspaceId);
  const parsed = parseDesignBundlePath(change.path, workspace.path);

  // Not part of a design bundle
  if (!parsed) {
    return;
  }

  const { id, bundlePath } = parsed;
  const store = DesignsStore.in(workspace.id);

  // Only the design file and the bundle directory itself carry
  // state held in the store.
  if (bundlePath !== '' && bundlePath !== DesignFileName) {
    return;
  }

  // Remove designs whose bundle or design file is gone
  if (change.kind === 'deleted') {
    store.remove(id);

    return;
  }

  // A change to the bundle directory that is not a deletion says
  // nothing about the design file.
  if (bundlePath === '') {
    return;
  }

  const design = await readDesign(
    resolveDesignBundleDirPath(id, workspace.path),
  );

  // The file is missing or is not a valid design
  if (!design) {
    return;
  }

  // Update the store with the design as it is on disk
  store.set(design);
}
