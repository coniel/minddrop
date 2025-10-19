import { PropertiesSchema } from '@minddrop/properties';

export interface ItemTypeInstance {
  /**
   * Unique identifier for the instance.
   */
  id: string;

  /**
   * The path to the item type instance directory.
   */
  path: string;

  /**
   * The item type. Should be a registered item type.
   */
  type: string;

  /**
   * The collective name of items, e.g. "Notes".
   * Used as the parent directory name. Must be unique.
   */
  namePlural: string;

  /**
   * The name of a single item, e.g. "Note".
   */
  nameSingular: string;

  /**
   * Date and time the instance was created.
   */
  created: Date;

  /**
   * Schema for the instance's user defined properties.
   */
  properties: PropertiesSchema;

  /**
   * A map of item file path to their UUID.
   */
  pathIdMap: Map<string, string>;

  /**
   * Description of the items.
   */
  description?: string;

  /**
   * The instance icon. Value depends on the icon type:
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   * - `asset`: 'asset:[asset-file-name]'
   */
  icon?: string;
}
