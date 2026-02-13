import { Design } from '@minddrop/designs';
import { PropertiesSchema } from '@minddrop/properties';
import { View } from '@minddrop/views';
import { DatabaseAutomation } from './DatabaseAutomation.types';

export interface Database {
  /**
   * A unique identifier for the database.
   */
  id: string;

  /**
   * Path to the database directory on the file system.
   */
  path: string;

  /**
   * Determines what type of entries are stored in the database. Must be a registered
   * data type.
   */
  dataType: string;

  /**
   * The entry serializer used to serialize entries in the database.
   * Must be a registered entry serializer.
   *
   * A value of 'data-type' indicates that the database is using the entry serializer
   * defined by its data type.
   */
  entrySerializer: 'data-type' | string;

  /**
   * The name of the database. Also used as the name for the database directory
   * on the file system.
   */
  name: string;

  /**
   * Name displayed in the UI when referencing a single database entry.
   */
  entryName: string;

  /**
   * The properties applied to all entries within the database.
   */
  properties: PropertiesSchema;

  /**
   * The date the database was created.
   */
  created: Date;

  /**
   * The date at which the database configuration was last modified.
   */
  lastModified: Date;

  /**
   * The database icon. Value depends on the icon type:
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   * - `asset`: 'asset:[asset-file-name]'
   *
   * If not provided, the base type icon is used.
   */
  icon: string;

  /**
   * Short description displayed in the UI.
   */
  description?: string;

  /**
   * Designs associated with the database.
   * Databases can contain the following types designs:
   * - `page`: used display entries as a page.
   * - `card`: used display entries in card based views.
   * - `list-item`: used display entries in list based views.
   */
  designs: Design[];

  /**
   * The database's views.
   */
  views: View[];

  /**
   * The database's automations if it has any.
   */
  automations?: DatabaseAutomation[];
}
