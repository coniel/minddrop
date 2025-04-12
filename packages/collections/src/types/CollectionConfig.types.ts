import { CollectionPropertySchema } from './CollectionPropertiesSchema.types';

export interface CollectionConfig {
  /**
   * The collection type. Should be a registered collection type.
   */
  type: string;

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
   * Date and time the collection was created.
   */
  created: Date;

  /**
   * Date and time the collection medata was last modified.
   */
  lastModified: Date;

  /**
   * Schemas for the collection's properties.
   */
  properties: CollectionPropertySchema[];

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
