export interface CollectionEntry {
  /**
   * The entry title. Typically the file name of the primary file associated
   * with the entry.
   */
  title: string;

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

  /**
   * Metadata associated with the entry. Such as file size and type, content
   * char/word count, etc.
   */
  metadata: CollectionEntryMetadata;

  /**
   * The entry's content, typically markdown content or stringified JSON.
   * May not be present if the collection type does not support content.
   */
  content?: string;
}

export type CollectionEntryPropertyValue =
  | string
  | string[]
  | number
  | boolean
  | Date
  | null;

export type CollectionEntryProperties = Record<
  string,
  CollectionEntryPropertyValue
>;

export interface CollectionEntryMetadata extends CollectionEntryProperties {
  /**
   * The date the entry was created.
   */
  created: Date;

  /**
   * The date the entry was last modified.
   */
  lastModified: Date;
}
