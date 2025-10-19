import { PropertyValue } from '@minddrop/properties';

export interface Item<TProperties extends ItemProperties = ItemProperties> {
  /**
   * The base data type of the item.
   */
  dataType:
    | 'data'
    | 'text'
    | 'markdown'
    | 'url'
    | 'image'
    | 'video'
    | 'audio'
    | 'pdf'
    | 'file';

  /**
   * The item's type ID. Can be one of the core types, a type added by an extension,
   * or a custom type defined by the end user.
   */
  type: string;

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
 * Core properties present on all items.
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
