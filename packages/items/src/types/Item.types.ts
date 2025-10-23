import { PropertyMap } from '@minddrop/properties';

export interface Item<TProperties extends PropertyMap = PropertyMap> {
  /**
   * The item type.
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

  /**
   * The item's note content in markdown format.
   * An empty string if the item has no note.
   */
  markdown: string;

  /**
   * An optional image associated with the item. Can be used as a
   * thumbnail, preview, or cover image.
   *
   * Should be the file name of an image asset file stored in the
   * item's assets directory.
   */
  image?: string;

  /**
   * The item icon. Value depends on the icon type:
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   * - `asset`: 'asset:[asset-file-name]'
   */
  icon?: string;
}

export type ItemCoreProperties = Pick<
  Item,
  'title' | 'created' | 'lastModified'
>;
