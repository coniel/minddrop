import { Collection } from './Collection.types';

export interface CollectionConfig extends Collection {
  /**
   * The path to the collection directory.
   */
  path: string;
}
