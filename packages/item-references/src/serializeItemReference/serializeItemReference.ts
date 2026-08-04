import { entityIdType } from '@minddrop/utils';
import { itemReferenceAdapters } from '../itemReferenceAdapters';

/**
 * Serializes a runtime item ID into a durable item reference using
 * its type's registered adapter. IDs without a registered adapter
 * pass through unchanged, acting as their own durable reference.
 *
 * @param id - The runtime item ID to serialize.
 * @returns The durable reference, or null if the adapter cannot serialize the ID.
 */
export function serializeItemReference(id: string): string | null {
  // Look up the adapter for the ID's type prefix
  const type = entityIdType(id);
  const adapter = type !== null ? itemReferenceAdapters.get(type) : undefined;

  // Pass IDs without a registered adapter through unchanged
  if (!adapter) {
    return id;
  }

  return adapter.serialize(id);
}
