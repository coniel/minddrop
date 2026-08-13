import { LayoutNotFoundError } from '../errors';
import { Layout } from '../types';
import { updateDesign } from '../updateDesign';
import { getLayoutDesign } from '../utils';

export type UpdateLayoutData = Partial<
  Pick<Layout, 'name' | 'description' | 'tree' | 'frame'>
>;

/**
 * Updates a layout by locating its parent design and writing the
 * change back through the design.
 *
 * @param id - The ID of the layout to update.
 * @param data - The data to update the layout with.
 * @returns The updated layout.
 *
 * @throws {LayoutNotFoundError} If the layout does not exist.
 */
export async function updateLayout(
  id: string,
  data: UpdateLayoutData,
): Promise<Layout> {
  // Find the parent design containing the layout
  const design = getLayoutDesign(id);

  // Ensure the layout exists
  if (!design) {
    throw new LayoutNotFoundError(id);
  }

  // Get the original layout from its parent design
  const original = design.layouts.find((layout) => layout.id === id)!;

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

  return updatedLayout;
}
