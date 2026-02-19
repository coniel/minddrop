import { InvalidParameterError, titleFromUrl } from '@minddrop/utils';
import { createDatabaseEntry } from '../createDatabaseEntry';
import { DatabaseEntry } from '../types';
import { getDefaultUrlProperty } from '../utils/getDefaultUrlProperty';

/**
 * Creates a database entry from a URL, setting the URL as the value
 * of the default matching URL based property.
 *
 * @param databaseId - The ID of the database to create the entry in.
 * @param url - The URL to create the entry from.
 *
 * @returns The newly created entry.
 *
 * @throws {InvalidParameterError} If the URL type is not supported by the database.
 */
export async function createDatabaseEntryFromUrl(
  databaseId: string,
  url: string,
): Promise<DatabaseEntry> {
  // Get the default URL property for the database
  const property = getDefaultUrlProperty(databaseId, url);

  // Ensure that a supported property exists
  if (!property) {
    throw new InvalidParameterError(
      `Database ${databaseId} does not support URLs.`,
    );
  }

  // Create the database entry, using the URL as its title and
  // the setting the URL property value.
  return createDatabaseEntry(databaseId, titleFromUrl(url), {
    [property.name]: url,
  });
}
