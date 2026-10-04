import { ContentColor } from '@minddrop/ui-theme';
import { getDatabase } from '../getDatabase';
import { getEntry } from '../getEntry';
import { updateEntry } from '../updateEntry';
import { updateEntryMetadata } from '../updateEntryMetadata';

/**
 * Sets or clears a database entry's color, i.e. the value of the
 * meta Color property.
 *
 * @param entryId - The ID of the entry to color.
 * @param color - The color to set, or null to clear it.
 *
 * @throws {EntryNotFoundError} If the entry does not exist.
 *
 * @dispatches databases:entry:metadata-updated
 */
export async function setEntryColor(
  entryId: string,
  color: ContentColor | null,
): Promise<void> {
  // Get the entry
  const entry = getEntry(entryId);
  // Get the database
  const database = getDatabase(entry.database);

  // Merge the color into the existing metadata, dropping the
  // field entirely when clearing.
  const { color: removed, ...metadata } = entry.metadata;

  await updateEntryMetadata(entryId, {
    ...metadata,
    ...(color ? { color } : {}),
  });

  // When the database declares a color property, mirror the value
  // into it so it persists to the entry file.
  const colorProperty = database.properties.find(
    (property) => property.type === 'color',
  );

  if (colorProperty) {
    await updateEntry(entryId, {
      properties: { [colorProperty.name]: color },
    });
  }
}
