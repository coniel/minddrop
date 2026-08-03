export interface CollectionEntryReferenceAdapter {
  /**
   * Converts runtime entry IDs into durable references for
   * disk serialization.
   */
  serializeEntries(entryIds: string[]): string[];

  /**
   * Resolves durable references back into runtime entry IDs.
   */
  resolveEntries(references: string[]): string[];
}

let adapter: CollectionEntryReferenceAdapter | null = null;

/**
 * Registers the adapter used to convert collection entry
 * references at the disk boundary. Pass null to unregister.
 */
export function registerCollectionEntryReferenceAdapter(
  referenceAdapter: CollectionEntryReferenceAdapter | null,
): void {
  adapter = referenceAdapter;
}

/**
 * Returns the registered entry reference adapter, or null when
 * none is registered.
 */
export function getCollectionEntryReferenceAdapter(): CollectionEntryReferenceAdapter | null {
  return adapter;
}
