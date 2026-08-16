import { DatabaseEntries, DatabaseEntry, Databases } from '@minddrop/databases';
import { EditorReference } from '@minddrop/editor';

/**
 * Describes an entry as a reference a wikilink can point at.
 *
 * An entry is referenced by its title alone, which is what makes a link
 * readable. A title shared by entries in more than one database names none of
 * them on its own, so those are qualified by the database they are in.
 *
 * The database is named rather than identified: its name is its directory
 * name, so a qualified reference reads as the path it is, and means the same
 * thing to anything else reading the file.
 *
 * @param entry - The entry to describe.
 * @returns The entry as a reference.
 */
export function resolveEntryReference(entry: DatabaseEntry): EditorReference {
  const database = Databases.get(entry.database, false);
  const isUnique = DatabaseEntries.isGloballyUniqueTitle(entry.title);

  return {
    reference:
      isUnique || !database ? entry.title : `${database.name}/${entry.title}`,
    // The link reads as the entry's title either way, the database being
    // there to name the entry rather than to be read
    label: entry.title,
    description: database?.name,
    icon: 'file-text',
  };
}
