import { createKeyValueStore } from '@minddrop/stores';
import { WorkspaceId } from './types';

export interface LoadedWorkspacesStoreValues {
  /**
   * The IDs of the workspaces whose content has been loaded into the
   * stores, in the order they loaded.
   */
  ids: WorkspaceId[];
}

// Which workspaces are loaded describes the running session, so the
// store is not persisted.
export const LoadedWorkspacesStore =
  createKeyValueStore<LoadedWorkspacesStoreValues>('Workspaces:Loaded', {
    ids: [],
  });
