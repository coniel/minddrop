import { CollectionType } from './CollectionType.types';

export interface CollectionConfig {
  /**
   * The name of the collection, e.g. "Notes".
   * Used as the collection directory name. Must be unique.
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
   * The collection icon. Value depends on the icon type:
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   * - `asset`: 'asset:[asset-file-name]'
   */
  icon?: string;
}
