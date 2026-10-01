import { Events } from '@minddrop/events';
import { applyNullableChanges } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { DesignUpdatedEvent } from '../events';
import { getDesign } from '../getDesign';
import {
  AspectRatioToken,
  ContentWidth,
  Design,
  DesignElement,
} from '../types';
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
   * The reading width the design's content is capped at. Null
   * clears it, returning the design to full width.
   */
  contentWidth?: ContentWidth | null;

  /**
   * The space between the design's side edges and its content, in
   * pixels. Null clears it.
   */
  sidePadding?: number | null;

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

  // Apply the changes and bump the last modified date. Cleared
  // optional fields are dropped rather than stored as a null.
  const updated: Design = {
    ...applyNullableChanges(design, data),
    lastModified: new Date(),
  };

  // Update the design in the store
  DesignsStore.set(updated);

  // Get the updated design
  const updatedDesign = getDesign(id);

  // Dispatch a design updated event
  Events.dispatch(DesignUpdatedEvent, {
    original: design,
    updated: updatedDesign,
  });

  // Write unowned designs to the file system
  if (!design.owner) {
    await writeDesign(design.id);
  }

  return updatedDesign;
}
