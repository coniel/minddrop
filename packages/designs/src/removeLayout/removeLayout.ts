import { LayoutNotFoundError } from '../errors';
import { Layout } from '../types';
import { updateDesign } from '../updateDesign';
import { getLayoutDesign } from '../utils';

/**
 * Removes a layout by locating its parent design and writing the
 * change back through the design.
 *
 * @param id - The ID of the layout to remove.
 * @returns The removed layout.
 *
 * @throws {LayoutNotFoundError} If the layout does not exist.
 */
export async function removeLayout(id: string): Promise<Layout> {
  // Find the parent design containing the layout
  const design = getLayoutDesign(id);

  // Ensure the layout exists
  if (!design) {
    throw new LayoutNotFoundError(id);
  }

  // Get the layout to remove from its parent design
  const layout = design.layouts.find((candidate) => candidate.id === id)!;

  // Remove the layout from the parent design's layouts array
  const newLayouts = design.layouts.filter((candidate) => candidate.id !== id);

  // Persist the updated parent design
  await updateDesign(design.id, { layouts: newLayouts });

  return layout;
}
