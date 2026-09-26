import { getDatabaseContentDefaults } from '../../getDatabaseContentDefaults';
import { findCustomContentTypeByUrl } from '../findCustomContentTypeByUrl';

/**
 * Resolves the ID of the database a URL is added to by default. It
 * is the first of these which is set:
 *
 * - The database of the custom content type matching the URL's
 *   domain.
 * - The database set for the URL content type.
 *
 * @param url - The URL.
 * @returns The database ID, or null when no default applies.
 */
export function resolveDefaultDatabaseIdForUrl(url: string): string | null {
  // Check for a custom content type matching the URL
  const customType = findCustomContentTypeByUrl(url);

  // Check if the custom type has a database. If so, use it.
  if (customType?.databaseId) {
    return customType.databaseId;
  }

  // Fall back to the URL default
  return getDatabaseContentDefaults().url;
}
