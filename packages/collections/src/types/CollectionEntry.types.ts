export interface CollectionEntry {
  /**
   * The entry title. Typically the file name of the primary file associated
   * with the entry.
   */
  ttile: string;

  /**
   * The relative path to the entry's primary file within the collection directory.
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
  metadata: CollectionEntryProperties;
}

export type CollectionEntryPropertyValue =
  | string
  | number
  | boolean
  | Date
  | null;

export type CollectionEntryProperties = Record<
  string,
  CollectionEntryPropertyValue
>;
