import { BinaryCollectionTypeConfig } from './BinaryCollectionTypeConfig.types';
import { TextCollectionTypeConfig } from './TextCollectionTypeConfig.types';

export type CollectionTypeConfig =
  | TextCollectionTypeConfig
  | BinaryCollectionTypeConfig;
