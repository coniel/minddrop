import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DesignsStore } from '../DesignsStore';
import { DesignDeletedEvent } from '../events';
import { getDesign } from '../getDesign';
import { resolveDesignBundleDirPath } from '../utils';

/**
 * Deletes a design.
 *
 * @param id - The ID of the design to delete.
 *
 * @dispatches 'designs:design:deleted'
 *
 * @throws {DesignNotFoundError} If the design does not exist.
 */
export async function deleteDesign(id: string): Promise<void> {
  // Get the design
  const design = getDesign(id);

  // Virtual designs have no bundle; only delete the bundle directory
  // (and the media inside it) for bundle-backed designs
  if (!design.virtual) {
    await Fs.removeDir(resolveDesignBundleDirPath(id), { recursive: true });
  }

  // Remove the design from the store
  DesignsStore.remove(id);

  // Dispatch a design deleted event
  Events.dispatch(DesignDeletedEvent, design);
}
