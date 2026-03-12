import { PropertyMap } from '@minddrop/properties';
import { View } from '@minddrop/views';

export interface DatabaseEntry<TProperties extends PropertyMap = PropertyMap> {
  /**
   * The entry's workspace-relative path, used as its unique identifier
   * (e.g. 'Books/Some Book.md').
   */
  id: string;

  /**
   * The name of the database the entry belongs to (same as the database's
   * directory name / ID).
   */
  database: string;

  /**
   * Absolute path to the entry's primary file.
   */
  path: string;

  /**
   * The entry title. Also used as the file name.
   */
  title: string;

  /**
   * The date the entry was created. Derived from the entry's 'created' property
   * if present, otherwise from file stat.
   */
  created: Date;

  /**
   * The date the entry was last modified. Derived from the entry's
   * 'last-modified' property if present, otherwise from file stat.
   */
  lastModified: Date;

  /**
   * The entry's properties.
   */
  properties: TProperties;

  /**
   * Supplementary data persisted to the database metadata file.
   * Safe to lose without actual data loss.
   */
  metadata: DatabaseEntryMetadata;
}

export type DatabaseEntryViewConfig = Pick<View, 'options' | 'data'>;

export interface DatabaseEntryMetadata {
  /**
   * Saved view state for virtual views, keyed by `designId:propertyName`.
   */
  views?: Record<string, DatabaseEntryViewConfig>;
}
