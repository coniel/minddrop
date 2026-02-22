import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { defaultDesignIds } from '../default-designs';
import { DesignDeletedEvent, DesignDeletedEventData } from '../events';
import { getDesign } from '../getDesign';
import { getDesignFilePath } from '../utils';

/**
 * Deletes a design.
 *
 * @param id - The ID of the design to delete.
 */
export async function deleteDesign(id: string): Promise<void> {
  // Get the design
  const design = getDesign(id);

  // It prevents deleting default designs
  if (defaultDesignIds.includes(design.id)) {
    throw new InvalidParameterError(
      `Cannot delete default design ${design.id}`,
    );
  }

  // Delete the design file
  await Fs.removeFile(getDesignFilePath(id));

  // Remove the design from the store
  DesignsStore.remove(id);

  // Dispatch a design deleted event
  Events.dispatch<DesignDeletedEventData>(DesignDeletedEvent, design);
}
