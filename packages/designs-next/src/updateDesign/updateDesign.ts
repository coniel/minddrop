import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignUpdatedEvent } from '../events';
import { getDesign } from '../getDesign';
import { Design, DesignElement } from '../types';
import { writeDesign } from '../writeDesign';

export interface UpdateDesignData {
  /**
   * The design's user-facing name.
   */
  name?: string;

  /**
   * The design's width in grid units.
   */
  columns?: number;

  /**
   * The design's height in grid units.
   */
  rows?: number;

  /**
   * The design's elements.
   */
  elements?: DesignElement[];
}

/**
 * Updates a design.
 *
 * @param id - The ID of the design to update.
 * @param data - The data to update the design with.
 * @returns The updated design.
 *
 * @throws {DesignNotFoundError} If the design does not exist.
 *
 * @dispatches designs-next:design:updated
 */
export async function updateDesign(
  id: string,
  data: UpdateDesignData,
): Promise<Design> {
  // Get the design
  const design = getDesign(id);

  // Update the design and bump its last modified date
  DesignsStore.update(design.id, { ...data, lastModified: new Date() });

  // Get the updated design
  const updatedDesign = getDesign(id);

  // Write the design to the file system
  await writeDesign(design.id);

  // Dispatch a design updated event
  Events.dispatch(DesignUpdatedEvent, {
    original: design,
    updated: updatedDesign,
  });

  return updatedDesign;
}
