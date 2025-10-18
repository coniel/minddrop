import { PropertyValue } from '@minddrop/properties';

export interface Item<TProperties extends ItemProperties = ItemProperties> {
  /**
   * Absolute path to the item's primary file.
   */
  path: string;

  /**
   * The item's properties.
   */
  properties: TProperties;
}

/**
 * Core properties that every item must have.
 */
export interface ItemCoreProperties {
  /**
   * The item title. Also used as the file name of the primary file associated
   * with the item.
   */
  title: string;

  /**
   * The date the item was created.
   */
  created: Date;

  /**
   * The date the item was last modified.
   */
  lastModified: Date;
}

/**
 * Custom properties defined by the config or end user.
 */
export type ItemCustomProperties = Record<string, PropertyValue>;

export type ItemProperties = ItemCoreProperties & ItemCustomProperties;
