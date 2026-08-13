import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DesignsStore } from '../DesignsStore';
import { DesignDeletedEvent, DesignDeletedEventData } from '../events';
import { getDesign } from '../getDesign';
import { resolveDesignBundleDirPath } from '../utils';

/**
 * Deletes a design.
 *
 * @param id - The ID of the design to delete.
 */
export async function deleteDesign(id: string): Promise<void> {
  // Get the design
  const design = getDesign(id);

  // Delete the design's bundle directory, taking its media with it
  await Fs.removeDir(resolveDesignBundleDirPath(id), { recursive: true });

  // Remove the design from the store
  DesignsStore.remove(id);

  // Dispatch a design deleted event
  Events.dispatch<DesignDeletedEventData>(DesignDeletedEvent, design);
}
