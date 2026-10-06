/**
 * A reference an entry has to another entry through one of its
 * collection property values.
 */
export interface EntryPropertyReference {
  kind: 'property';

  /**
   * The ID of the referencing entry.
   */
  entryId: string;

  /**
   * The name of the collection property containing the reference.
   */
  propertyName: string;

  /**
   * The ID of the referenced entry.
   */
  targetEntryId: string;
}

/**
 * A wikilink in an entry's content.
 */
export interface EntryWikilinkReference {
  kind: 'wikilink';

  /**
   * The ID of the referencing entry.
   */
  entryId: string;

  /**
   * What the link points at, as written before any `#` fragment or
   * `|` label, e.g. `Book` or `Books/Book`.
   */
  reference: string;

  /**
   * The part of the target the link points into, as written after
   * the `#`.
   */
  fragment?: string;
}

/**
 * A reference an entry has to another entry.
 */
export type EntryReference = EntryPropertyReference | EntryWikilinkReference;
