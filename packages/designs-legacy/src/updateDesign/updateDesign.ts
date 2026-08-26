import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignUpdatedEvent } from '../events';
import { getDesign } from '../getDesign';
import { Design } from '../types';
import { writeDesign } from '../writeDesign';

type UpdateDesignData = Partial<
  Pick<Design, 'name' | 'properties' | 'layouts'>
>;

/**
 * Updates a design.
 *
 * @param id - The ID of the design to update.
 * @param data - The data to update the design with.
 * @returns The updated design.
 */
export async function updateDesign(
  id: string,
  data: UpdateDesignData,
): Promise<Design> {
  // Get the design
  const design = getDesign(id);

  // Update the design and bump its last modified date
  DesignsStore.update(design.id, { ...data, lastModified: new Date() });

  // Write the updated design to the file system
  await writeDesign(design.id);

  // Get the updated design
  const updatedDesign = getDesign(id);

  // Dispatch a design updated event
  Events.dispatch(DesignUpdatedEvent, {
    original: design,
    updated: updatedDesign,
  });

  return updatedDesign;
}
