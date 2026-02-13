import { ViewTypesStore } from '../ViewTypesStore';
import { ViewTypeNotRegisteredError } from '../errors';
import { ViewType } from '../types';

/**
 * Gets the view type with the specified type.
 *
 * @param type The type of the view type to get.
 * @param throwOnNotFound Whether to throw an error if the view type is not
 * registered.
 * @returns The view type.
 *
 * @throws ViewTypeNotRegisteredError if the view type is not registered.
 */
export function getViewType(type: string): ViewType;
export function getViewType(
  type: string,
  throwOnNotFound: false,
): ViewType | null;
export function getViewType(
  type: string,
  throwOnNotFound = true,
): ViewType | null {
  // Get the view type from the store
  const viewType = ViewTypesStore.get(type);

  // Throw an error if the view type is not registered
  if (!viewType && throwOnNotFound) {
    throw new ViewTypeNotRegisteredError(type);
  }

  return viewType ?? null;
}
