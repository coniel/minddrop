import { PropertyMap } from '@minddrop/properties';

export interface Item<TProperties extends PropertyMap = PropertyMap> {
  /**
   * The item's unique identifier.
   */
  id: string;

  /**
   * The ID of the item type instance the item belongs to.
   */
  type: string;

  /**
   * Absolute path to the item's primary file.
   */
  path: string;

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

  /**
   * The item's properties.
   */
  properties: TProperties;
}
