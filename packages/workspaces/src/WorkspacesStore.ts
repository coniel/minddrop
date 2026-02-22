import { createArrayStore } from '@minddrop/utils';
import { Workspace } from './types';

export const WorkspacesStore = createArrayStore<Workspace>('id');

/**
 * Retrieves a workspace by its ID.
 *
 * @param id - The ID of the workspace to retrieve.
 * @returns The workspace or null if it doesn't exist.
 */
export const useWorkspace = (id: string): Workspace | null => {
  return (
    WorkspacesStore.useAllItems().find((workspace) => workspace.id === id) ||
    null
  );
};

/**
 * Retrieves all workspaces.
 *
 * @returns And array of all workspaces.
 */
export const useWorkspaces = (): Workspace[] => {
  return WorkspacesStore.useAllItems();
};
