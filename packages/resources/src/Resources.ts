import { createResourceStore } from './createResourceStore';
import { createConfigsStore } from './createConfigsStore';
import { createResource } from './createResource';
import { createTypedResource } from './createTypedResource';
import { registerResource } from './registerResource';
import { ResourceApisStore } from './ResourceApisStore';
import { ResourcesApi } from './types';
import { unregisterResource } from './unregisterResource';
import { generateResourceDocument } from './generateResourceDocument';
import { registerResourceStorageAdapter } from './registerResourceStorageAdapter';
import { unregisterResourceStorageAdapter } from './unregisterResourceStorageAdapter';
import { deserializeResourceDocument } from './deserializeResourceDocument';

export const Resources: ResourcesApi = {
  createResourceStore,
  createConfigsStore,
  create: createResource,
  createTyped: createTypedResource,
  register: registerResource,
  unregister: unregisterResource,
  generateDocument: generateResourceDocument,
  get: ResourceApisStore.get,
  getAll: ResourceApisStore.getAll,
  clear: ResourceApisStore.clear,
  registerStorageAdapter: registerResourceStorageAdapter,
  unregisterStorageAdapter: unregisterResourceStorageAdapter,
  deserializeDocument: deserializeResourceDocument,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};
