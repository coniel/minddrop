import { ContentColor } from '@minddrop/ui-theme';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { updateDatabaseEntry } from '../updateDatabaseEntry';
import { updateEntryMetadata } from '../updateEntryMetadata';

/**
 * Sets or clears a database entry's color, i.e. the value of the
 * meta Color property.
 *
 * @param entryId - The ID of the entry to color.
 * @param color - The color to set, or null to clear it.
 *
 * @dispatches database-entries:entry:metadata-updated
 *
 * @throws {DatabaseEntryNotFoundError} If the entry does not exist.
 */
export async function setEntryColor(
  entryId: string,
  color: ContentColor | null,
): Promise<void> {
  // Get the entry
  const entry = getDatabaseEntry(entryId);
  // Get the database
  const database = getDatabase(entry.database);

  // Merge the color into the existing metadata, dropping the
  // field entirely when clearing
  const { color: removed, ...metadata } = entry.metadata;

  await updateEntryMetadata(entryId, {
    ...metadata,
    ...(color ? { color } : {}),
  });

  // When the database declares a color property, mirror the value
  // into it so it persists to the entry file
  const colorProperty = database.properties.find(
    (property) => property.type === 'color',
  );

  if (colorProperty) {
    await updateDatabaseEntry(entryId, {
      properties: { [colorProperty.name]: color },
    });
  }
}
