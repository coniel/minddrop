/**
 * Derives the key under which an entry's metadata is stored in its
 * database metadata file. Metadata files live inside their database
 * directory and only hold that database's own entries, so the key is
 * the entry path relative to the database: the entry path with the
 * leading `${databasePath}/` segment removed.
 *
 * Falls back to the full entry path if it is not prefixed with the
 * database path.
 *
 * @param entryPath - The absolute path of the entry file.
 * @param databasePath - The absolute path of the database directory.
 * @returns The database-relative metadata key.
 */
export function entryMetadataKey(
  entryPath: string,
  databasePath: string,
): string {
  const prefix = `${databasePath}/`;

  // Fall back to the full path if the expected prefix is absent
  if (!entryPath.startsWith(prefix)) {
    return entryPath;
  }

  // Strip the database path prefix to get the database-relative key
  return entryPath.slice(prefix.length);
}
