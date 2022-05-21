import { createConfigsStore } from '../createConfigsStore';
import { RegisteredResourceApi, RegisteredTypedResourceApi } from '../types';

export const ResourceApisStore = createConfigsStore<
  RegisteredResourceApi | RegisteredTypedResourceApi
>({
  idField: 'resource',
});
