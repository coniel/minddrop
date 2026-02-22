import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DesignsStore } from '../DesignsStore';
import { DesignDeletedEvent, DesignDeletedEventData } from '../events';
import { getDesign } from '../getDesign';

/**
 * Deletes a design.
 *
 * @param id - The ID of the design to delete.
 */
export async function deleteDesign(id: string): Promise<void> {
  // Get the design
  const design = getDesign(id);

  // Delete the design file
  await Fs.removeFile(design.path);

  // Remove the design from the store
  DesignsStore.remove(id);

  // Dispatch a design deleted event
  Events.dispatch<DesignDeletedEventData>(DesignDeletedEvent, design);
}
