import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import { LayoutUpdatedEvent, LayoutUpdatedEventData } from '../events';
import { getLayout } from '../getLayout';
import { Layout } from '../types';
import { updateDesign } from '../updateDesign';

type UpdateLayoutData = Partial<
  Pick<Layout, 'name' | 'description' | 'tree' | 'frame'>
>;

/**
 * Updates a layout by locating its parent design and writing the change
 * back through the design.
 *
 * @param id - The ID of the layout to update.
 * @param data - The data to update the layout with.
 * @returns The updated layout.
 *
 * @throws {LayoutNotFoundError} If the layout does not exist.
 * @throws {DesignNotFoundError} If the layout has no parent design.
 */
export async function updateLayout(
  id: string,
  data: UpdateLayoutData,
): Promise<Layout> {
  // Get the original layout
  const original = getLayout(id);

  // Find the parent design that contains this layout
  const design = DesignsStore.getAllArray().find((candidate) =>
    candidate.layouts.some((layout) => layout.id === id),
  );

  // Throw if the layout has no parent design
  if (!design) {
    throw new DesignNotFoundError(`parent of layout ${id}`);
  }

  // Build the updated layout with a bumped last modified date
  const updatedLayout: Layout = {
    ...original,
    ...data,
    lastModified: new Date(),
  };

  // Replace the layout inside the parent design's layouts array
  const newLayouts = design.layouts.map((layout) =>
    layout.id === id ? updatedLayout : layout,
  );

  // Persist the updated parent design
  await updateDesign(design.id, { layouts: newLayouts });

  // Dispatch a layout updated event
  Events.dispatch<LayoutUpdatedEventData>(LayoutUpdatedEvent, {
    original,
    updated: updatedLayout,
  });

  return updatedLayout;
}
