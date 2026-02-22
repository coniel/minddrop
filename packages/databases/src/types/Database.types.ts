import { PropertiesSchema, PropertyType } from '@minddrop/properties';
import { DatabaseAutomation } from './DatabaseAutomation.types';

export type DatabaseDesignType = 'page' | 'card' | 'list';

/**
 * A [design element ID]: [database property name] map.
 */
export type DesignPropertyMap = Record<string, string>;

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
   * A [property type]: [property name] map of the default property
   * to fill when creating a new entry from a file or data transfer.
   *
   * If not provided, the first file based property supporting the data type
   * will be used.
   */
  defaultProperties?: Partial<Record<PropertyType, string>>;

  /**
   * A [design ID]: [design property map] mapping database properties to design
   * elements.
   */
  designPropertyMaps: Record<string, DesignPropertyMap>;

  /**
   * A [design type]: [design ID] map of the default design to use when
   * rendering entries.
   */
  defaultDesigns: Record<string, string>;

  /**
   * The database's automations if it has any.
   */
  automations?: DatabaseAutomation[];
}
