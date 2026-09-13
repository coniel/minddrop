import { matchItemReference } from '../matchItemReference';

/**
 * Resolves a durable item reference into its runtime item ID.
 *
 * @param reference - The durable item reference to resolve.
 * @param workspaceId - The workspace to resolve the reference in. Omit for the active workspace.
 * @returns The runtime ID, or null if the item is unrecognized or does not exist.
 */
export function resolveItemReference(
  reference: string,
  workspaceId?: string,
): string | null {
  return matchItemReference(reference, workspaceId)?.id ?? null;
}
