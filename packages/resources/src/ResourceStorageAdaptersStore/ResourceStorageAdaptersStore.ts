import { createConfigsStore } from '../createConfigsStore';
import { ResourceStorageAdapterConfig } from '../types';

export const ResourceStorageAdaptersStore =
  createConfigsStore<ResourceStorageAdapterConfig>({
    idField: 'id',
  });
