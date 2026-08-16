import { PropertyMap } from '@minddrop/properties';
import { EntityId } from '@minddrop/utils';
import { DatabaseId } from './Database.types';

export type DatabaseEntryId = EntityId<'database-entry'>;

export interface DatabaseEntry<TProperties extends PropertyMap = PropertyMap> {
  /**
   * The entry's opaque unique identifier. Minted when the entry is
   * created or first indexed, persisted in the SQL index, and
   * regenerated if the index is rebuilt. Durable disk data must
   * reference entries by path, not ID.
   */
  id: DatabaseEntryId;

  /**
   * The name of the database the entry belongs to (same as the database's
   * directory name / ID).
   */
  database: DatabaseId;

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
   * Hash of the entry file's contents, used to detect changes made
   * outside the app. Set when read from disk, absent on entries
   * hydrated from the index.
   */
  contentHash?: string;

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

export interface DatabaseEntryViewConfig {
  options?: object;
  data?: object;
}

export interface DatabaseEntryMetadata {
  /**
   * Saved options/data for the virtual views backing view elements
   * embedded in layouts, keyed by `propertyName:layoutId`.
   */
  embeddedViewConfigs?: Record<string, DatabaseEntryViewConfig>;
}
