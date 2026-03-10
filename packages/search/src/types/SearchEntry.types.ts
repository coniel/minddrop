import { PropertyType } from '@minddrop/properties';

/**
 * The data required to index a database entry in the
 * search system. Sent from the renderer to Bun during
 * incremental sync.
 */
export interface SearchEntryData {
  /**
   * The unique entry ID.
   */
  id: string;

  /**
   * The ID of the database the entry belongs to.
   */
  databaseId: string;

  /**
   * Absolute path to the entry's primary file.
   */
  path: string;

  /**
   * The entry title.
   */
  title: string;

  /**
   * The date the entry was created, as epoch milliseconds.
   */
  created: number;

  /**
   * The date the entry was last modified, as epoch milliseconds.
   */
  lastModified: number;

  /**
   * The entry's dynamic property values.
   */
  properties: SearchEntryProperty[];
}

/**
 * A single property value for a search entry.
 */
export interface SearchEntryProperty {
  /**
   * The property name.
   */
  name: string;

  /**
   * The property type from the database schema.
   */
  type: PropertyType;

  /**
   * The property value. Type depends on the property type:
   * - text, formatted-text, select, url, icon, file, image, title: string
   * - number: number
   * - toggle: boolean
   * - date, created, last-modified: number (epoch ms)
   * - collection: string[]
   */
  value: string | number | boolean | string[] | null;
}
