import { PropertyMap } from '@minddrop/properties';
import { EntityId } from '@minddrop/utils';
import { DatabaseId } from './Database.types';

export type DatabaseEntryTemplateId = EntityId<'database-entry-template'>;

export interface DatabaseEntryTemplate {
  /**
   * A unique identifier for the template.
   */
  id: DatabaseEntryTemplateId;

  /**
   * The ID of the database the template belongs to. Derived from
   * the template file's location at load time.
   */
  database: DatabaseId;

  /**
   * Display name shown in the configuration panel and entry
   * creation menus.
   */
  name: string;

  /**
   * Optional default title applied to entries created from the
   * template. Falls back to the localised untitled title.
   */
  defaultTitle?: string;

  /**
   * The pre-filled property values. Only properties with a value are
   * stored. File based property values are the names of files stored
   * in the template's directory inside the database's hidden dir.
   */
  properties: PropertyMap;

  /**
   * The date the template was created.
   */
  created: Date;

  /**
   * The date the template was last modified.
   */
  lastModified: Date;
}

/**
 * An entry template as stored in its template file, without the
 * database ID which is derived from the file's location.
 */
export type StoredDatabaseEntryTemplate = Omit<
  DatabaseEntryTemplate,
  'database'
>;

/**
 * The caller-supplied data for creating an entry template: the
 * template without its managed fields (ID, database, timestamps).
 */
export type DatabaseEntryTemplateData = Omit<
  DatabaseEntryTemplate,
  'id' | 'database' | 'created' | 'lastModified'
>;

/**
 * The caller-supplied data for updating an entry template.
 */
export type UpdateDatabaseEntryTemplateData =
  Partial<DatabaseEntryTemplateData>;
