import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
import { DesignsStore } from '../DesignsStore';
import { DesignDeletedEvent } from '../events';
import { getDesign } from '../getDesign';
import { resolveDesignFilePath } from '../utils';

/**
 * Deletes a design, removing its file unless it is owned.
 *
 * @param id - The ID of the design to delete.
 * @param workspaceId - The workspace the design belongs to. Omit for the active workspace.
 *
 * @throws {DesignNotFoundError} If the design does not exist.
 *
 * @dispatches designs-next:design:deleted
 */
export async function deleteDesign(
  id: string,
  workspaceId?: string,
): Promise<void> {
  // Get the design
  const design = getDesign(id, true, workspaceId);

  // Remove the design from the workspace's store record
  DesignsStore.in(workspaceId).remove(id);

  // Dispatch a design deleted event
  Events.dispatch(DesignDeletedEvent, design);

  // Remove unowned designs' files
  if (!design.owner) {
    await Fs.removeFile(
      resolveDesignFilePath(id, Workspaces.resolvePath(workspaceId)),
    );
  }
}
