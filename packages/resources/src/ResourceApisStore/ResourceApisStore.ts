import { createConfigsStore } from '../createConfigsStore';
import { ResourceApi } from '../types';

export const ResourceApisStore = createConfigsStore<ResourceApi<any, any, any>>(
  {
    idField: 'resource',
  },
);
