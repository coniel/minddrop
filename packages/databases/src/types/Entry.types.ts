import { ContentViewConfig } from '@minddrop/content-views';
import { PropertyMap } from '@minddrop/properties';
import { ContentColor } from '@minddrop/ui-theme';
import { EntityId } from '@minddrop/utils';
import type { EntryEntityType } from '../constants';
import { DatabaseId } from './Database.types';

export type EntryId = EntityId<typeof EntryEntityType>;

export interface Entry<TProperties extends PropertyMap = PropertyMap> {
  /**
   * The entry's opaque unique identifier. Minted when the entry is
   * created or first indexed, persisted in the SQL index, and
   * regenerated if the index is rebuilt. Durable disk data must
   * reference entries by path, not ID.
   */
  id: EntryId;

  /**
   * The name of the database the entry belongs to (same as the database's
   * directory name / ID).
   */
  database: DatabaseId;

  /**
   * Path to the entry's primary file, relative to its database
   * directory. Can be resolved to a file system path with
   * `resolveEntryPath`.
   */
  path: string;

  /**
   * The entry title. Also used as the file name.
   */
  title: string;

  /**
   * The date the entry was created. Derived from the entry's 'created'
   * property if present, otherwise from its metadata sidecar, which is
   * seeded from file stat the first time the entry is indexed.
   */
  created: Date;

  /**
   * The date the entry was last modified by the app. Derived from the
   * entry's 'last-modified' property if present, otherwise from its
   * metadata sidecar, which is seeded from file stat the first time the
   * entry is indexed. Edits made outside the app do not update it.
   */
  lastModified: Date;

  /**
   * Hash of the entry file's contents, used to detect changes made
   * outside the app. Set when read from disk, absent on entries
   * hydrated from the index.
   */
  contentHash?: string;

  /**
   * The ID of the entry this entry was duplicated from. Held in
   * the store for the session only, never persisted.
   */
  duplicatedFrom?: EntryId;

  /**
   * The entry's properties.
   */
  properties: TProperties;

  /**
   * App managed data persisted to the entry's metadata sidecar.
   * Losing it degrades the entry's timestamps to whenever its file
   * was last rewritten.
   */
  metadata: EntryMetadata;
}

/**
 * App managed data belonging to one property of an entry.
 */
export type EntryPropertyMetadata = Record<string, unknown>;

export interface EntryMetadata {
  /**
   * The date the entry was created. Persisted here because file
   * birthtime is reset by atomic writes and cannot be restored
   * portably.
   */
  created?: Date;

  /**
   * The date the entry was last modified by the app.
   */
  lastModified?: Date;

  /**
   * The configs of the views design elements embed for the entry's
   * collection properties. Keyed by design element ID and view type.
   */
  embeddedViewConfigs?: Record<string, ContentViewConfig>;

  /**
   * The entry's color, i.e. the value of the meta Color property.
   */
  color?: ContentColor;

  /**
   * Metadata belonging to individual properties, keyed by property
   * name.
   */
  properties?: Record<string, EntryPropertyMetadata>;
}
