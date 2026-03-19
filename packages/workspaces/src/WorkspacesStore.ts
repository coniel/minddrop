import { createObjectStore } from '@minddrop/stores';
import { Workspace } from './types';

export const WorkspacesStore = createObjectStore<Workspace>(
  'Workspaces:Workspaces',
  'id',
);

/**
 * Retrieves a workspace by its ID.
 *
 * @param id - The ID of the workspace to retrieve.
 * @returns The workspace or null if it doesn't exist.
 */
export const useWorkspace = (id: string): Workspace | null => {
  return WorkspacesStore.useItem(id);
};

/**
 * Retrieves all workspaces.
 *
 * @returns An array of all workspaces.
 */
export const useWorkspaces = (): Workspace[] => {
  return WorkspacesStore.useAllItemsArray();
};
