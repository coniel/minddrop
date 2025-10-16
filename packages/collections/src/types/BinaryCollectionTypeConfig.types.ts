import { BaseCollectionTypeConfig } from './BaseCollectionTypeConfig.types';

export interface BinaryCollectionTypeConfig extends BaseCollectionTypeConfig {
  /**
   * The data type of the collection.
   */
  type: 'binary';

  /**
   * The file extensions supported by the collection type.
   *
   * Used to filter files when displaying a file picker for selecting
   * files to add to the collection.
   *
   * If not provided, all file types will be allowed.
   */
  fileExtensions?: string[];
}
