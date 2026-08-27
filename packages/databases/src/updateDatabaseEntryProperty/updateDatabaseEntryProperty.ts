import { Collections } from '@minddrop/collections';
import { PathConflictError } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { PropertyValue } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { renameDatabaseEntry } from '../renameDatabaseEntry';
import { DatabaseEntry } from '../types';
import { updateDatabaseEntry } from '../updateDatabaseEntry';
import { virtualCollectionId, withImplicitMetadataProperties } from '../utils';

/**
 * Updates a property on a database entry. Title property updates
 * rename the entry instead, as the entry title is its file name;
 * an empty title renames the entry to the localised untitled
 * title, incrementing on conflict.
 *
 * @param entryId - The ID of the entry to update.
 * @param propertyName - The name of the property to update.
 * @param value - The new value of the property.
 *
 * @returns The updated entry.
 *
 * @throws {InvalidParameterError} If the database does not have a property with the specified name.
 */
export async function updateDatabaseEntryProperty(
  entryId: string,
  propertyName: string,
  value: PropertyValue,
): Promise<DatabaseEntry> {
  // Get the entry
  const entry = getDatabaseEntry(entryId);
  // Get the database
  const database = getDatabase(entry.database);

  // Look up the property schema, including the implicit entry
  // metadata properties
  const propertySchema = withImplicitMetadataProperties(
    database.properties,
  ).find((property) => property.name === propertyName);

  // Ensure the property exists on the database
  if (!propertySchema) {
    throw new InvalidParameterError(
      `Database ${database.id} does not have a property named ${propertyName}.`,
    );
  }

  // Title properties are updated by renaming the entry
  if (propertySchema.type === 'title') {
    return renameEntryToTitle(entry.id, String(value ?? ''));
  }

  // Timestamp metadata is managed by the system, so writes to it
  // leave the entry unchanged
  if (
    propertySchema.type === 'created' ||
    propertySchema.type === 'last-modified'
  ) {
    return entry;
  }

  // Collection properties are updated through their virtual
  // collection so both stores stay in sync
  if (propertySchema.type === 'collection' && Array.isArray(value)) {
    const collectionId = virtualCollectionId(entry.id, propertyName);

    if (Collections.get(collectionId, false)) {
      await Collections.update(collectionId, { items: value });

      return getDatabaseEntry(entry.id);
    }
  }

  // Update the entry
  return updateDatabaseEntry(entry.id, {
    properties: {
      [propertyName]: value,
    },
  });
}

/**
 * Renames the entry to the given title, falling back to the
 * localised untitled title for empty titles. Returns the entry
 * unchanged when the new path conflicts on disk.
 */
async function renameEntryToTitle(
  entryId: string,
  title: string,
): Promise<DatabaseEntry> {
  // Ignore surrounding whitespace
  const trimmedTitle = title.trim();

  try {
    // Empty titles rename the entry to the localised untitled
    // title, incrementing on conflict
    if (!trimmedTitle) {
      return await renameDatabaseEntry(
        entryId,
        i18n.t('labels.untitled'),
        true,
      );
    }

    return await renameDatabaseEntry(entryId, trimmedTitle);
  } catch (error) {
    // Validation guards against store conflicts, but a non-entry
    // file on disk can still conflict with the new path
    if (error instanceof PathConflictError) {
      return getDatabaseEntry(entryId);
    }

    throw error;
  }
}
