import { Collections } from '@minddrop/collections';
import { getReferencingEntries } from '../utils';
import { writeDatabaseEntry } from '../writeDatabaseEntry';

/**
 * Rewrites the durable files referencing the given entries so
 * their addresses reflect the entries' current paths.
 *
 * @param entryIds - The referenced entry IDs.
 */
export async function rewriteEntryReferences(
  entryIds: string[],
): Promise<void> {
  // Rewrite each referencing entry's file
  const referencingEntries = getReferencingEntries(entryIds);

  await Promise.all(
    referencingEntries.map((entry) => writeDatabaseEntry(entry.id)),
  );

  const referencedIds = new Set(entryIds);

  // Find persisted collections containing the entries
  const affectedCollections = Collections.Store.getAllArray().filter(
    (collection) =>
      !collection.virtual &&
      collection.entries.some((id) => referencedIds.has(id)),
  );

  // Rewrite the persisted collection files
  await Promise.all(
    affectedCollections.map((collection) => Collections.write(collection.id)),
  );
}
