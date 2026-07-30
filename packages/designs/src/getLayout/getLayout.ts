import { getLayout as getLayoutFromStore } from '../LayoutsStore';
import { LayoutNotFoundError } from '../errors';
import { Layout } from '../types';

/**
 * Retrieves a layout by its ID.
 *
 * @param id - The ID of the layout to retrieve.
 * @param throwOnNotFound - Whether to throw an error if the layout is not found, defaults to true.
 * @returns The retrieved layout or null if it doesn't exist and throwOnNotFound is false.
 *
 * @throws {LayoutNotFoundError} If the layout with the specified ID does not exist and throwOnNotFound is true.
 */
export function getLayout(id: string): Layout;
export function getLayout(id: string, throwOnNotFound: false): Layout | null;
export function getLayout(id: string, throwOnNotFound = true): Layout | null {
  // Find the layout across all designs in the store
  const layout = getLayoutFromStore(id);

  // If we need to throw on not found, ensure the layout exists
  if (!layout && throwOnNotFound) {
    throw new LayoutNotFoundError(id);
  }

  return layout;
}
