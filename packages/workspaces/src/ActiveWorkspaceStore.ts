import { createKeyValueStore } from '@minddrop/stores';
import { WorkspacesStore } from './WorkspacesStore';
import { Workspace, WorkspaceId } from './types';

export interface ActiveWorkspaceStoreValues {
  /**
   * The ID of the active workspace, or null when no workspace is active.
   */
  id: WorkspaceId | null;
}

// Which workspace is open belongs to the app on this device, not to
// any workspace, so it persists at the app-config level.
export const ActiveWorkspaceStore =
  createKeyValueStore<ActiveWorkspaceStoreValues>(
    'Workspaces:ActiveWorkspace',
    { id: null },
    {
      persistTo: 'app-config',
      namespace: 'active-workspace',
    },
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
