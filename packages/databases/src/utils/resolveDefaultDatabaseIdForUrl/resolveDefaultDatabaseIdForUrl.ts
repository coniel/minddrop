import { getDatabase } from '../../getDatabase';
import { getDatabaseContentDefaults } from '../../getDatabaseContentDefaults';
import { findCustomContentTypeByUrl } from '../findCustomContentTypeByUrl';
import { getDefaultUrlProperty } from '../getDefaultUrlProperty';

/**
 * Resolves the ID of the database a URL is added to. The target
 * database when it exists and can hold the URL, otherwise the first
 * of these which is set:
 *
 * - The database of the custom content type matching the URL's
 *   domain.
 * - The database set for the URL content type.
 *
 * @param url - The URL.
 * @param targetDatabaseId - The ID of the database preferred when it can hold the URL.
 * @returns The database ID, or null when no default applies.
 */
export function resolveDefaultDatabaseIdForUrl(
  url: string,
  targetDatabaseId?: string,
): string | null {
  // Check if the target database exists and can hold the URL. If so,
  // use it.
  if (
    targetDatabaseId &&
    getDatabase(targetDatabaseId, false) &&
    getDefaultUrlProperty(targetDatabaseId, url)
  ) {
    return targetDatabaseId;
  }

  // Check for a custom content type matching the URL
  const customType = findCustomContentTypeByUrl(url);

  // Check if the custom type has a database. If so, use it.
  if (customType?.databaseId) {
    return customType.databaseId;
  }

  // Fall back to the URL default
  return getDatabaseContentDefaults().url;
}
