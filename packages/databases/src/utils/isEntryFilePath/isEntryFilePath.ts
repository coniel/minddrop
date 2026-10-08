import { EntrySerializersRegistry } from '../../EntrySerializersRegistry';
import { Database } from '../../types';

/**
 * Checks whether a path inside a database directory is one of the
 * database's entry files.
 *
 * @param relativePath - The path, relative to the database directory.
 * @param database - The database the path is in.
 * @returns Whether the path is an entry file.
 */
export function isEntryFilePath(
  relativePath: string,
  database: Database,
): boolean {
  // Split the path into its segments
  const segments = relativePath.split('/');
  // Allow entry files one directory down in a database storing each
  // entry in its own directory.
  const maxDepth = database.propertyFileStorage === 'entry' ? 2 : 1;
  // Get the extension of the database serializer's files
  const { fileExtension } = EntrySerializersRegistry.get(
    database.entrySerializer,
  );

  // Check the path is an entry file
  return (
    // Within the entry file depth
    segments.length <= maxDepth &&
    // Not hidden, nor inside a hidden directory
    segments.every((segment) => !segment.startsWith('.')) &&
    // Has the serializer's extension
    relativePath.endsWith(`.${fileExtension}`)
  );
}
