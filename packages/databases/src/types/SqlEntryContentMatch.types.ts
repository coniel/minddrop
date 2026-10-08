import type { PropertyType } from '@minddrop/properties';

/**
 * A text or content property value matching a full-text search
 * of entry content.
 */
export interface SqlEntryContentMatch {
  /**
   * The ID of the entry the value belongs to.
   */
  entryId: string;

  /**
   * The title of the entry the value belongs to.
   */
  entryTitle: string;

  /**
   * The ID of the entry's database.
   */
  databaseId: string;

  /**
   * The name of the entry's database.
   */
  databaseName: string;

  /**
   * The icon of the entry's database.
   */
  databaseIcon: string;

  /**
   * The name of the property the value belongs to.
   */
  propertyName: string;

  /**
   * The type of the property the value belongs to.
   */
  propertyType: PropertyType;

  /**
   * An excerpt of the value around the match. The matched words are
   * wrapped in the requested highlight markers.
   */
  snippet: string;

  /**
   * The match's BM25 rank. Lower values are more relevant.
   */
  rank: number;
}
