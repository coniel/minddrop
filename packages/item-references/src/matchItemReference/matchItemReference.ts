import { entityIdType } from '@minddrop/utils';
import { itemReferenceAdapters } from '../itemReferenceAdapters';
import { ItemReferenceMatch } from '../types';

/**
 * Matches a durable item reference against the registered adapters
 * in registration order, returning the first adapter's match.
 * References without a claiming adapter that are typed entity IDs
 * match as their own runtime ID. Returns null when nothing
 * recognizes the reference.
 *
 * @param reference - The durable item reference to match.
 * @returns The match, or null if nothing recognizes the reference.
 */
export function matchItemReference(
  reference: string,
): ItemReferenceMatch | null {
  // Offer the reference to each adapter in registration order
  for (const adapter of itemReferenceAdapters.values()) {
    const match = adapter.match(reference);

    if (match) {
      return match;
    }
  }

  // Extract the reference's type prefix
  const type = entityIdType(reference);

  // Fall back to treating unclaimed typed entity IDs as their own
  // runtime ID
  if (!reference.includes('/') && type !== null) {
    return { type, id: reference };
  }

  return null;
}
