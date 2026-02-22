import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignUpdatedEvent, DesignUpdatedEventData } from '../events';
import { getDesign } from '../getDesign';
import { Design, RootElement } from '../types';
import { writeDesign } from '../writeDesign';

/**
 * Updates a design's tree.
 *
 * @param id - The ID of the design to update.
 * @param tree - The new design tree.
 * @returns The updated design.
 */
export async function updateDesign(
  id: string,
  tree: RootElement,
): Promise<Design> {
  // Get the design
  const design = getDesign(id);

  // Update the design tree and last modified date
  DesignsStore.update(design.id, { tree, lastModified: new Date() });

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
