import { CollectionPropertySchema } from './CollectionPropertiesSchema.types';

export interface BaseCollectionTypeConfig {
  /**
   * A unique identifier for the collection type.
   */
  id: string;

  /**
   * The type of data the collection type manages.
   *
   * - `text`: The collection type manages text-based files (e.g. markdown).
   * - `file`: The collection type manages files (e.g. images).
   */
  type: 'text' | 'file';

  /**
   * User friendly description of the collection type arranged as a
   * [language code]: { name: string, details: string } map.
   */
  description: Record<string, CollectionTypeDescription>;

  /**
   * Default properties applied to all entries in the collection.
   */
  coreProperties?: CollectionPropertySchema[];
}

interface CollectionTypeDescription {
  /**
   * Name displayed in the UI.
   */
  name: string;

  /**
   * Short description displayed in the UI.
   */
  details: string;
}
