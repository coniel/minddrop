import { PropertyMap } from '@minddrop/properties';

export interface DatabaseEntry<
  TProperties extends PropertyMap = PropertyMap,
  TData extends object = {},
> {
  /**
   * The name of the database the entry belongs to.
   */
  database: string;

  /**
   * Absolute path to the item's primary file.
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

  /**
   * The item's data. Only applicable to entry types belonging to data types
   * that define a custom serializer.
   */
  data?: TData;
}

export type DatabaseEntryCoreProperties = Pick<
  DatabaseEntry,
  'title' | 'created' | 'lastModified'
>;
