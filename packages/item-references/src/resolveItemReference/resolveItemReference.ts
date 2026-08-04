import { matchItemReference } from '../matchItemReference';

/**
 * Resolves a durable item reference into its runtime item ID.
 *
 * @param reference - The durable item reference to resolve.
 * @returns The runtime ID, or null if the item is unrecognized or does not exist.
 */
export function resolveItemReference(reference: string): string | null {
  return matchItemReference(reference)?.id ?? null;
}
