import { EntryReference } from './EntryReference.types';

/**
 * A row of the SQL entry_references table.
 */
export interface SqlEntryReferenceRow {
  /**
   * The ID of the referencing entry.
   */
  entry_id: string;

  /**
   * The kind of reference.
   */
  kind: EntryReference['kind'];

  /**
   * The name of the collection property containing the reference. Null
   * for a wikilink.
   */
  property_name: string | null;

  /**
   * The ID of the referenced entry. Null for a wikilink.
   */
  target_entry_id: string | null;

  /**
   * The wikilink's reference, as written. Null for a property
   * reference.
   */
  target_reference: string | null;

  /**
   * The wikilink's fragment. Null for a property reference, or a
   * wikilink written without one.
   */
  fragment: string | null;
}
