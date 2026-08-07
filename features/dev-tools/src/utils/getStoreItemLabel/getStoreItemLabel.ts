import { getStoreItemId } from '../getStoreItemId';

// Fields holding an item's display name, in the order they are
// looked for
const LabelFields = ['name', 'title', 'label'];

/**
 * Returns the value naming a store item, falling back to its
 * identifier when it has no naming field.
 *
 * @param item - The store item to label.
 * @returns The item's label.
 */
export function getStoreItemLabel(item: Record<string, unknown>): string {
  for (const field of LabelFields) {
    const value = item[field];

    if (typeof value === 'string' && value) {
      return value;
    }
  }

  return getStoreItemId(item);
}
