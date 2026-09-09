import { PropertiesSchema, PropertyType } from '@minddrop/properties';
import { EntityId } from '@minddrop/utils';
import { ViewOpenMode } from '@minddrop/views';
import { LayoutContext } from '../layoutContexts';
import { DatabaseAutomation } from './DatabaseAutomation.types';

export type PropertyFileStorage = 'root' | 'common' | 'property' | 'entry';

export type DatabaseId = EntityId<'database'>;

export interface Database {
  /**
   * A unique identifier for the database.
   */
  id: DatabaseId;

  /**
   * Path to the database directory, relative to the workspace root.
   * Can be resolved to a file system path with `resolveDatabasePath`.
   */
  path: string;

  /**
   * The entry serializer used to serialize entries in the database.
   * Must be a registered entry serializer.
   */
  entrySerializer: string;

  /**
   * The name of the database. Derived from the database
   * directory name on the file system.
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
  propertyFileStorage: PropertyFileStorage;

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
   * The ID of the design this database uses. When null, no design is
   * resolved and the renderer uses an inline fallback.
   */
  designId: string | null;

  /**
   * A [design property name]: [database property name] map. Resolves
   * design-level property bindings to this database's own properties.
   */
  designPropertyMap: Record<string, string>;

  /**
   * The name of the select property entries are colored by. When
   * null or unset, entries are colored by the meta Color property.
   */
  colorProperty?: string | null;

  /**
   * A [layout context]: [layout ID] map of the default layout to use when
   * rendering entries in each display context.
   */
  defaultLayouts: Record<string, string>;

  /**
   * How entries are opened when clicked.
   * - `dialog`: Opens the entry as a dialog overlay.
   * - `panel`: Opens the entry in a slide out panel.
   * - `in-place`: Opens the entry in place, replacing the current view.
   * - `new-tab`: Opens the entry in a new tab.
   * - `split`: Opens the entry in split view next to the current main content.
   * @default 'dialog'
   */
  entryOpenMode: ViewOpenMode;

  /**
   * The IDs of the database's views in display order. Normalized
   * against the view files at load time.
   */
  views: string[];

  /**
   * The IDs of the database's designs in display order. Normalized
   * against the design files at load time.
   */
  designs: string[];

  /**
   * The IDs of the database's entry templates in display order.
   * Normalized against the template files at load time.
   */
  entryTemplates: string[];

  /**
   * Whether to hide the views toolbar in the database view. Intended
   * for databases with a single view, giving them a cleaner UI.
   * @default false
   */
  hideViewsToolbar?: boolean;

  /**
   * The database's automations if it has any.
   */
  automations?: DatabaseAutomation[];

  /**
   * A [layout context]: [design ID] map of the design to render
   * entries with in each display context.
   */
  defaultDesigns?: Partial<Record<LayoutContext, string>>;
}
