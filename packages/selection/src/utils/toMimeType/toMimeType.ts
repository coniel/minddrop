import { MINDDROP_DATA_KEY } from '../../constants';

/**
 * Returns a MindDrop MIME type for a given data type.
 *
 * @param type - The type to get the MindDrop MIME type for.
 * @param isJson [true] - Whether the data is a JSON string.
 * @returns The MindDrop MIME type.
 */
export function toMimeType(type: string, isJson = true): string {
  return `${MINDDROP_DATA_KEY}.${type}${isJson ? '+json' : ''}`;
}
