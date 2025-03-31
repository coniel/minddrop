import { CollectionConfig } from './CollectionConfig.types';

export interface Collection extends CollectionConfig {
  /**
   * The path to the collection directory.
   */
  path: string;
}
