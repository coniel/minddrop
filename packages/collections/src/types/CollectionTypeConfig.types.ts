import { FileCollectionTypeConfig } from './FileCollectionTypeConfig.types';
import { TextCollectionTypeConfig } from './TextCollectionTypeConfig.types';

export type CollectionTypeConfig =
  | TextCollectionTypeConfig
  | FileCollectionTypeConfig;
