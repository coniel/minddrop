import { PropertiesSchema } from '@minddrop/properties';

export type ItemDataType =
  | 'markdown'
  | 'url'
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'file'
  | 'page'
  | 'space';

export interface BaseItemTypeConfig {
  /**
   * The base data type of the item.
   */
  dataType: ItemDataType;

  /**
   * A unique identifier for this item type.
   */
  type: string;

  /**
   * Name displayed in the UI.
   */
  name: string;

  /**
   * Short description displayed in the UI.
   */
  description: string;

  /**
   * The base item type's properties schema.
   */
  properties: PropertiesSchema;

  /**
   * The item type icon, should be a content icon reference string:
   * 'content-icon:[icon-name]:[color]'.
   *
   * Used as the default icon for items types based off of this base type.
   */
  icon: string;
}
