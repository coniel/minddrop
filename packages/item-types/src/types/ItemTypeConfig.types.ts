import { ItemDataType } from '@minddrop/base-item-types';
import { PropertiesSchema } from '@minddrop/properties';
import { ContentColor } from '@minddrop/utils';

export interface ItemTypeConfig {
  /**
   * The `type` of the base item type off which this item type is derived.
   */
  baseType: string;

  /**
   * The data type of items of this type.
   */
  dataType: ItemDataType;

  /**
   * Name displayed in the UI when referencing a single item.
   * Also used as the `type` value for items.
   */
  nameSingular: string;

  /**
   * Name displayed in the UI when referencing multiple items.
   * Also used as the name for the directory where items of this type are stored.
   */
  namePlural: string;

  /**
   * The properties defined on items of this type.
   */
  properties: PropertiesSchema;

  /**
   * The item type icon. Value depends on the icon type:
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   * - `asset`: 'asset:[asset-file-name]'
   *
   * If not provided, the base type icon is used.
   */
  icon?: string;

  /**
   * The item type color. Used to style the item type icon and badges in the UI.
   */
  color: ContentColor;

  /**
   * Short description displayed in the UI.
   */
  description?: string;
}
