import { LayoutNotFoundError } from '../errors';
import { Layout } from '../types';
import { getLayoutDesign } from '../utils';

/**
 * Retrieves a layout by its ID from the design containing it.
 *
 * @param id - The ID of the layout to retrieve.
 * @param throwOnNotFound - Whether to throw an error if the layout is not found, defaults to true.
 * @returns The retrieved layout or null if it doesn't exist and throwOnNotFound is false.
 *
 * @throws {LayoutNotFoundError} If the layout does not exist and throwOnNotFound is true.
 */
export function getLayout(id: string): Layout;
export function getLayout(id: string, throwOnNotFound: false): Layout | null;
export function getLayout(id: string, throwOnNotFound = true): Layout | null {
  // Find the design containing the layout
  const design = getLayoutDesign(id);

  // Get the layout from its parent design
  const layout = design?.layouts.find((candidate) => candidate.id === id);

  // If we need to throw on not found, ensure the layout exists
  if (!layout && throwOnNotFound) {
    throw new LayoutNotFoundError(id);
  }

  return layout || null;
}
