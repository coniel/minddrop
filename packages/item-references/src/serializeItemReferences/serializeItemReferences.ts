import { serializeItemReference } from '../serializeItemReference';

/**
 * Serializes runtime item IDs into durable item references using the
 * registered adapters, preserving input order. IDs the adapter
 * cannot serialize are dropped.
 *
 * @param ids - The runtime item IDs to serialize.
 * @param workspaceId - The workspace the items belong to. Omit for the active workspace.
 * @returns The durable item references.
 */
export function serializeItemReferences(
  ids: string[],
  workspaceId?: string,
): string[] {
  return ids.flatMap((id) => {
    // Serialize the ID through its type's adapter
    const reference = serializeItemReference(id, workspaceId);

    // Drop IDs the adapter could not serialize
    return reference === null ? [] : [reference];
  });
}
