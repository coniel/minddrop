/**
 * What a custom content type matches content by: files by their
 * extension, or URLs by their domain.
 */
export type CustomContentTypeKind = 'file' | 'url';

export interface CustomContentType {
  /**
   * A unique ID.
   */
  id: string;

  /**
   * The user-given name.
   */
  name: string;

  /**
   * Whether the type matches files or URLs.
   */
  kind: CustomContentTypeKind;

  /**
   * The file extensions (file kind) or domains (URL kind) the type
   * matches, normalized.
   */
  matchers: string[];

  /**
   * The ID of the database that matched content is added to. Null
   * when no database is set.
   */
  databaseId: string | null;
}

/**
 * The data a custom content type is created from.
 */
export type CustomContentTypeData = Omit<CustomContentType, 'id'>;
