import { ContentColor } from '@minddrop/core';
import { UserIcon } from '@minddrop/icons';

export enum CollectionType {
  JSON = 'json',
  Markdown = 'markdown',
  File = 'file',
  Weblink = 'weblink',
}

export interface Collection {
  /**
   * A unique identifier for the collection.
   */
  id: string;

  /**
   * The relative path to the collection directory containing
   * its items.
   */
  path: string;

  /**
   * The type of items handled by the collection.
   */
  type: CollectionType;

  /**
   * Date and time the collection was created.
   */
  created: Date;

  /**
   * Date and time the collection medata was last modified.
   */
  lastModified: Date;

  /**
   * The name of the collection, e.g. "Notes".
   */
  name: string;

  /**
   * The name of a single collection item, e.g. "Note".
   */
  itemName: string;

  /**
   * Description of the collection.
   */
  description?: string;

  /**
   * Color used when displaying collection label and icon in the UI.
   */
  color?: ContentColor;

  /**
   * Icon used to represent the collection in the UI.
   */
  icon?: UserIcon;
}
