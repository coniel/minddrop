import { UserIcon } from '@minddrop/icons';

export enum CollectionType {
  JSON = 'json',
  Markdown = 'markdown',
  File = 'file',
  Weblink = 'weblink',
}

export interface Collection {
  /**
   * The name of the collection, e.g. "Notes".
   * Must be unique.
   */
  name: string;

  /**
   * The name of a single collection item, e.g. "Note".
   */
  itemName: string;

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
   * Description of the collection.
   */
  description?: string;

  /**
   * Icon used to represent the collection in the UI.
   */
  icon?: UserIcon;
}
