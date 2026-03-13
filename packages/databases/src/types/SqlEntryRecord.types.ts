import type { PropertyType } from '@minddrop/properties';

/**
 * The data required to represent a database entry in
 * the SQL database. Contains the entry's core fields and
 * its dynamic property values.
 */
export interface SqlEntryRecord {
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
   * JSON-serialized DatabaseEntryMetadata.
   */
  metadata: string;

  /**
   * The entry's dynamic property values.
   */
  properties: SqlEntryPropertyRecord[];
}

/**
 * A single property value for a SQL entry record.
 */
export interface SqlEntryPropertyRecord {
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
   * - text, formatted-text, url, icon, file, image, title: string
   * - number: number
   * - toggle: boolean
   * - date, created, last-modified: number (epoch ms)
   * - select, collection: string[]
   */
  value: string | number | boolean | string[] | null;
}
