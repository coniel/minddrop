import { getDatabase } from '../../getDatabase';
import { DatabaseEntry } from '../../types';

/**
 * Resolves the icon an entry is displayed with: its own icon
 * property value, falling back to its database's icon.
 *
 * @param entry - The database entry.
 * @returns The stringified content icon.
 *
 * @throws {DatabaseNotFoundError} If the entry's database does not exist.
 */
export function resolveEntryIcon(entry: DatabaseEntry): string {
  const database = getDatabase(entry.database);

  // Read the entry's icon property value, if the database has an
  // icon property.
  const iconProperty = database.properties.find(
    (property) => property.type === 'icon',
  );
  const icon = iconProperty ? entry.properties[iconProperty.name] : undefined;

  // Fall back to the database icon when the entry has none
  return typeof icon === 'string' && icon ? icon : database.icon;
}
