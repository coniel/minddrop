import { PropertyMap } from '@minddrop/properties';

export interface ItemTypeConfig {
  /**
   * The ID of the base item type of the item.
   */
  baseType: string;

  /**
   * The unique ID of the item type. Used as the `type` property on items.
   */
  type: string;

  /**
   * Name dispLayed in the UI.
   */
  name: string;

  /**
   * The item type icon. Value depends on the icon type:
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   * - `asset`: 'asset:[asset-file-name]'
   */
  icon?: string;

  /**
   * Short description displayed in the UI.
   */
  description?: string;

  /**
   * The properties defined on items of this type.
   */
  properties: PropertyMap;
}
