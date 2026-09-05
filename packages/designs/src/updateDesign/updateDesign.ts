import { Events } from '@minddrop/events';
import { PropertiesSchema } from '@minddrop/properties';
import { DesignsStore } from '../DesignsStore';
import { DesignUpdatedEvent } from '../events';
import { getDesign } from '../getDesign';
import { Design } from '../types';
import { writeDesign } from '../writeDesign';

export interface UpdateDesignData {
  /**
   * The design's user-facing name.
   */
  name?: string;

  /**
   * The layouts inside this design.
   */
  layouts?: Design['layouts'];

  /**
   * The design's property schema. Only valid on database designs.
   */
  properties?: PropertiesSchema;
}

/**
 * Updates a design.
 *
 * @param id - The ID of the design to update.
 * @param data - The data to update the design with.
 * @returns The updated design.
 *
 * @dispatches 'designs:design:updated'
 *
 * @throws {DesignNotFoundError} If the design does not exist.
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

  // Dispatch a design updated event
  Events.dispatch(DesignUpdatedEvent, {
    original: design,
    updated: updatedDesign,
  });

  // Persist bundle-backed designs; virtual designs are persisted by
  // their owner via the update event
  if (!design.virtual) {
    await writeDesign(design.id);
  }

  return updatedDesign;
}
