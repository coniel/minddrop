import { PropertyMap } from '@minddrop/properties';

export interface DatabaseEntry<TProperties extends PropertyMap = PropertyMap> {
  /**
   * A unique identifier for the entry.
   */
  id: string;

  /**
   * The ID of the database the entry belongs to.
   */
  database: string;

  /**
   * Absolute path to the entry's primary file.
   */
  path: string;

  /**
   * The item title. Also used as the file name of the primary file associated
   * with the item.
   */
  title: string;

  /**
   * The date the item was created.
   */
  created: Date;

  /**
   * The date the item was last modified.
   */
  lastModified: Date;

  /**
   * The item's properties.
   */
  properties: TProperties;
}

export type DatabaseEntryCoreProperties = Pick<
  DatabaseEntry,
  'id' | 'title' | 'created' | 'lastModified'
>;
