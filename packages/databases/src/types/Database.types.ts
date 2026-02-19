import { Design } from '@minddrop/designs';
import { PropertiesSchema } from '@minddrop/properties';
import { View } from '@minddrop/views';
import { DatabaseAutomation } from './DatabaseAutomation.types';

export type DatabaseDesignType = 'page' | 'card' | 'list';

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
   * The entry serializer used to serialize entries in the database.
   * Must be a registered entry serializer.
   */
  entrySerializer: string;

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
   * Determines how property files are stored.
   * - `root`: Stored in the root directory of the database.
   * - `common`: All property files are stored in a common subdirectory.
   * - `property`: Stored in a subdirectory named after the property.
   * - `entry`: Stored in a subdirectory named after the entry.
   */
  propertyFileStorage: 'root' | 'common' | 'property' | 'entry';

  /**
   * The directory to store property files in if `propertyFileStorage` is
   * set to `common`.
   */
  propertyFilesDir?: string;

  /**
   * Designs associated with the database.
   * Databases can contain the following types designs:
   * - `page`: used display entries as a page.
   * - `card`: used display entries in card based views.
   * - `list`: used display entries in list based views.
   */
  designs: Design[];

  /**
   * The IDs of the designs to use as the default for each design type.
   * If a default design is not provided for a type, the first design
   * of that type will be used. If no design of that type exists, the
   * global default design will be used.
   */
  defaultDesigns: Partial<Record<DatabaseDesignType, string>>;

  /**
   * The database's views.
   */
  views: View[];

  /**
   * The database's automations if it has any.
   */
  automations?: DatabaseAutomation[];
}
