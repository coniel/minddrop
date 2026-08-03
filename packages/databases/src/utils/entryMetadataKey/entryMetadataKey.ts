/**
 * Derives the key under which an entry's metadata is stored in its
 * database metadata file. Metadata files live inside their database
 * directory and only hold that database's own entries, so the key is
 * the entry ID relative to the database: the workspace-relative entry
 * ID with the leading `${databaseId}/` segment removed.
 *
 * Falls back to the full entry ID if it is not prefixed with the
 * database ID.
 *
 * @param entryId - The workspace-relative entry ID.
 * @param databaseId - The ID of the database the entry belongs to.
 * @returns The database-relative metadata key.
 */
export function entryMetadataKey(entryId: string, databaseId: string): string {
  const prefix = `${databaseId}/`;

  // Fall back to the full ID if the expected prefix is absent
  if (!entryId.startsWith(prefix)) {
    return entryId;
  }

  // Strip the database ID prefix to get the database-relative key
  return entryId.slice(prefix.length);
}
