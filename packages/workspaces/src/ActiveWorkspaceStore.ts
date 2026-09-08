import { createKeyValueStore } from '@minddrop/stores';
import { WorkspacesStore } from './WorkspacesStore';
import { Workspace, WorkspaceId } from './types';

export interface ActiveWorkspaceStoreValues {
  /**
   * The ID of the active workspace, or null when no workspace is active.
   */
  id: WorkspaceId | null;
}

// Not persisted: the workspaces config file holds the active workspace
// path and is what it is restored from on initialization.
export const ActiveWorkspaceStore =
  createKeyValueStore<ActiveWorkspaceStoreValues>(
    'Workspaces:ActiveWorkspace',
    { id: null },
  );

/**
 * Retrieves the active workspace.
 *
 * @returns The active workspace or null if there is none.
 */
export const useActiveWorkspace = (): Workspace | null => {
  const id = ActiveWorkspaceStore.useValue('id');

  return WorkspacesStore.useItem(id ?? '');
};
