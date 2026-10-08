import { StoredContentView } from '../../types';

/**
 * Checks whether a parsed value has the fields identifying a stored
 * content view.
 *
 * @param value - The value to check.
 * @returns True if the value has a string ID and type.
 */
export function isStoredContentView(
  value: unknown,
): value is StoredContentView {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'type' in value &&
    typeof value.type === 'string'
  );
}
