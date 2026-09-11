import { Events } from '@minddrop/events';
import { reconcileIdOrder } from '@minddrop/utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspacesReorderedEvent } from '../events';
import { Workspace } from '../types';
import { writeWorkspacesConfig } from '../writeWorkspacesConfig';

/**
 * Reorders the workspaces, listing them in the given ID order. IDs
 * which match no workspace are ignored, and workspaces missing from
 * the order are appended.
 *
 * @param ids - The workspace IDs in the desired order.
 * @returns The workspaces in their new order.
 *
 * @dispatches workspaces:reordered
 */
export async function reorderWorkspaces(ids: string[]): Promise<Workspace[]> {
  // Order the workspaces by the given IDs
  const workspaces = reconcileIdOrder(ids, WorkspacesStore.getAllArray());

  // The store lists workspaces in insertion order, so reload them
  // in their new order.
  WorkspacesStore.clear();
  WorkspacesStore.load(workspaces);

  // Dispatch the workspaces reordered event
  Events.dispatch(WorkspacesReorderedEvent, workspaces);

  // Write the workspaces config to persist the new order
  await writeWorkspacesConfig();

  return workspaces;
}
