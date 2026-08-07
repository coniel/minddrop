// Fields holding an item's identifier, in the order they are
// looked for
const IdentifierFields = ['id', 'key', 'type', 'name', 'path'];

/**
 * Returns the value identifying a store item, falling back to its
 * serialized form when it has no identifying field.
 *
 * @param item - The store item to identify.
 * @returns The item's identifier.
 */
export function getStoreItemId(item: Record<string, unknown>): string {
  for (const field of IdentifierFields) {
    const value = item[field];

    if (typeof value === 'string' && value) {
      return value;
    }
  }

  return JSON.stringify(item);
}
