import { Properties } from '@minddrop/properties';
import { getDatabase } from '../../getDatabase';

// TODO: Implement URL filtering logic once URL properties support constraints

/**
 * Filters a list of URLs to only include URLs that are valid for the given database.
 *
 * @param databaseId - The ID of the database to filter the URLs for.
 * @param urls - The list of URLs to filter.
 * @returns A map of valid and invalid URLs.
 */
export function filterValidDatabaseUrls(
  databaseId: string,
  urls: string[],
): { validUrls: string[]; invalidUrls: string[] } {
  // Get the database
  const database = getDatabase(databaseId);

  // Get a list of URL properties used by the database
  const urlProperties = database.properties.filter(Properties.isUrl);

  // If the database does not have any URL properties, all URLs
  // are invalid.
  if (urlProperties.length === 0) {
    return { validUrls: [], invalidUrls: urls };
  }

  // If the database contains URL properties, all URLs are valid
  return { validUrls: urls, invalidUrls: [] };
}
