import { Properties } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { createDatabaseEntry } from '../createDatabaseEntry';
import { DatabaseEntry } from '../types';
import { resolveDefaultPropertyOfType } from '../utils';

/**
 * Creates an untitled database entry with a text as its content.
 *
 * @param databaseId - The ID of the database to create the entry in.
 * @param text - The text to create the entry from.
 * @returns The newly created entry.
 *
 * @throws {InvalidParameterError} If the database has no content property.
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {NotRegisteredError} If the entry serializer is not registered.
 *
 * @dispatches databases:entry:created
 */
export async function createDatabaseEntryFromText(
  databaseId: string,
  text: string,
): Promise<DatabaseEntry> {
  // Resolve the database's default content property
  const property = resolveDefaultPropertyOfType(
    databaseId,
    Properties.schemas.content.type,
  );

  // Ensure that a content property exists
  if (!property) {
    throw new InvalidParameterError(
      `Database ${databaseId} does not support text.`,
    );
  }

  // Create the entry with the text as its content
  return createDatabaseEntry(databaseId, undefined, {
    [property.name]: text,
  });
}
