import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignUpdatedEvent } from '../events';
import { getDesign } from '../getDesign';
import { AspectRatioToken, Design, DesignElement } from '../types';
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
   * The design's aspect ratio. Null clears it, returning the design
   * to natural height.
   */
  aspectRatio?: AspectRatioToken | null;

  /**
   * The design's elements.
   */
  elements?: DesignElement[];
}

/**
 * Updates a design, writing it to the file system unless it is owned.
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

  // Apply the changes and bump the last modified date
  const { aspectRatio, ...changes } = data;
  const { aspectRatio: currentAspectRatio, ...current } = design;
  const updated: Design = { ...current, ...changes, lastModified: new Date() };

  // Keep the aspect ratio unless the update changes or clears it,
  // dropping the field rather than storing a null.
  const nextAspectRatio =
    aspectRatio === undefined ? currentAspectRatio : aspectRatio;

  if (nextAspectRatio) {
    updated.aspectRatio = nextAspectRatio;
  }

  // Update the design in the store
  DesignsStore.set(updated);

  // Get the updated design
  const updatedDesign = getDesign(id);

  // Write unowned designs to the file system
  if (!design.owner) {
    await writeDesign(design.id);
  }

  // Dispatch a design updated event
  Events.dispatch(DesignUpdatedEvent, {
    original: design,
    updated: updatedDesign,
  });

  return updatedDesign;
}
