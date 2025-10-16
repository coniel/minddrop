export interface CollectionEntry {
  /**
   * The path to the collection that the entry belongs to.
   */
  collectionPath: string;

  /**
   * Absolute path to the collection entry's primary file.
   */
  path: string;

  /**
   * The entry's properties.
   */
  properties: CollectionEntryProperties;
}

export type CollectionEntryPropertyValue =
  | string
  | string[]
  | number
  | boolean
  | Date
  | null;

/**
 * Core properties that every collection entry must have.
 */
export interface CollectionEntryCoreProperties {
  /**
   * The entry title. Typically the file name of the primary file associated
   * with the entry.
   */
  title: string;

  /**
   * The date the entry was created.
   */
  created: Date;

  /**
   * The date the entry was last modified.
   */
  lastModified: Date;

  /**
   * The note content in markdown format. `null` if the entry does not have
   * an associated note.
   */
  note: string | null;
}

/**
 * Custom properties defined by the collection config or end user.
 */
export type CollectionEntryCustomProperties = Record<
  string,
  CollectionEntryPropertyValue
>;

export type CollectionEntryProperties = CollectionEntryCoreProperties &
  CollectionEntryCustomProperties;
