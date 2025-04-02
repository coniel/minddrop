import { CollectionConfig } from './CollectionConfig.types';

export type UpdateCollectionData = Partial<
  Omit<CollectionConfig, 'created' | 'lastUpdated'>
>;
