import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import { LayoutDeletedEvent, LayoutDeletedEventData } from '../events';
import { getLayout } from '../getLayout';
import { Layout } from '../types';
import { updateDesign } from '../updateDesign';

/**
 * Removes a layout by locating its parent design and writing the change
 * back through the design.
 *
 * @param id - The ID of the layout to remove.
 * @returns The removed layout.
 *
 * @dispatches 'designs:layout:deleted'
 *
 * @throws {LayoutNotFoundError} If the layout does not exist.
 * @throws {DesignNotFoundError} If the layout has no parent design.
 */
export async function removeLayout(id: string): Promise<Layout> {
  // Get the layout to remove
  const layout = getLayout(id);

  // Find the parent design that contains this layout
  const design = DesignsStore.getAllArray().find((candidate) =>
    candidate.layouts.some((candidateLayout) => candidateLayout.id === id),
  );

  // Throw if the layout has no parent design
  if (!design) {
    throw new DesignNotFoundError(`parent of layout ${id}`);
  }

  // Remove the layout from the parent design's layouts array
  const newLayouts = design.layouts.filter(
    (candidateLayout) => candidateLayout.id !== id,
  );

  // Persist the updated parent design
  await updateDesign(design.id, { layouts: newLayouts });

  // Dispatch a layout deleted event
  Events.dispatch<LayoutDeletedEventData>(LayoutDeletedEvent, layout);

  return layout;
}
