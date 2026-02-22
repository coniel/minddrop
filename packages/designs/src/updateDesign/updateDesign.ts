import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { defaultDesignIds } from '../default-designs';
import { DesignUpdatedEvent, DesignUpdatedEventData } from '../events';
import { getDesign } from '../getDesign';
import { Design } from '../types';
import { writeDesign } from '../writeDesign';

type UpdateDesignData = Partial<Pick<Design, 'name' | 'tree'>>;

/**
 * Updates a design's tree.
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

  // Prevent updating default designs
  if (defaultDesignIds.includes(design.id)) {
    throw new InvalidParameterError(
      `Cannot update default design ${design.id}`,
    );
  }

  // Update the design tree and last modified date
  DesignsStore.update(design.id, { ...data, lastModified: new Date() });

  // Write the updated design to the file system
  await writeDesign(design.id);

  // Get the updated design
  const updatedDesign = getDesign(id);

  // Dispatch a design updated event
  Events.dispatch<DesignUpdatedEventData>(DesignUpdatedEvent, {
    original: design,
    updated: updatedDesign,
  });

  // Return the updated design
  return updatedDesign;
}
