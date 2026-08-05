import { DataViewTypesStore } from '../DataViewTypesStore';
import { DataViewTypeNotRegisteredError } from '../errors';
import { DataViewType } from '../types';

/**
 * Gets the data view type with the specified type.
 *
 * @param type The type of the data view type to get.
 * @param throwOnNotFound Whether to throw an error if the data view type is not
 * registered.
 * @returns The data view type.
 *
 * @throws DataViewTypeNotRegisteredError if the data view type is not registered.
 */
export function getDataViewType(type: string): DataViewType;
export function getDataViewType(
  type: string,
  throwOnNotFound: false,
): DataViewType | null;
export function getDataViewType(
  type: string,
  throwOnNotFound = true,
): DataViewType | null {
  // Get the data view type from the store
  const viewType = DataViewTypesStore.get(type);

  // Throw an error if the data view type is not registered
  if (!viewType && throwOnNotFound) {
    throw new DataViewTypeNotRegisteredError(type);
  }

  return viewType ?? null;
}
