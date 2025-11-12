import { DataTypesStore } from '../DataTypesStore';
import { DataTypeNotFoundError } from '../errors';
import { DataType } from '../types';

/**
 * Retrieves a data type by type.
 *
 * @param type - The type of the data type to retrieve.
 * @param throwOnNotFound - Whether to throw if the data type is not found.
 *   Defaults to true.
 *
 * @returns The data type.
 *
 * @throws {DataTypeNotFoundError} Thrown if the data type does not exist and
 *   throwOnNotFound is true.
 */
export function getDataType(type: string): DataType;
export function getDataType(
  type: string,
  throwOnNotFound: false,
): DataType | null;
export function getDataType(
  type: string,
  throwOnNotFound = true,
): DataType | null {
  // Get the data type from the store
  const dataType = DataTypesStore.get(type);

  // If the data type doesn't exist and throwOnNotFound is true, throw an error
  if (!dataType && throwOnNotFound) {
    throw new DataTypeNotFoundError(type);
  }

  return dataType || null;
}
