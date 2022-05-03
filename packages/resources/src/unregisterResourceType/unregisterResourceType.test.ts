import { core } from '../test-utils';
import {
  TypedResourceConfig,
  ResourceTypeConfig,
  TypedResourceTypeDocumentDataSchema,
} from '../types';
import { ResourceTypeNotRegisteredError } from '../errors';
import { registerResourceType } from '../registerResourceType';
import { createConfigsStore } from '../createConfigsStore';
import { unregisterResourceType } from './unregisterResourceType';

interface Data {
  foo: string;
}

const schema: TypedResourceTypeDocumentDataSchema<{}, Data> = {
  foo: {
    type: 'string',
  },
};

// Test resource config
const resourceConfig: TypedResourceConfig = {
  resource: 'tests:test',
  dataSchema: {},
};

// Create a configs store for the test resource type configs
const typeConfigsStore = createConfigsStore<ResourceTypeConfig>({
  idField: 'type',
});

const typeConfig: ResourceTypeConfig<{}, Data> = {
  type: 'test',
  dataSchema: schema,
};

describe('unregisterResourceType', () => {
  beforeEach(() => {
    // Register a resource type
    registerResourceType(core, resourceConfig, typeConfigsStore, typeConfig);
  });

  it('unregisters the config from the type configs store', () => {
    // Unregister a resource type
    unregisterResourceType(core, resourceConfig, typeConfigsStore, typeConfig);

    // Config should no longer be in the type configs store
    expect(typeConfigsStore.get('test')).toBeUndefined();
  });

  it('dispatches a `[resource]:unregister` event', (done) => {
    // Listen to `tests:test:unregister` events
    core.addEventListener('tests:test:unregister', (payload) => {
      // Payload data should be the type config
      expect(payload.data).toEqual(typeConfig);
      done();
    });

    // Unregister a  resource type
    unregisterResourceType(core, resourceConfig, typeConfigsStore, typeConfig);
  });

  it('throws if the type is not registered', () => {
    // Attempt to unregister a config which is not registered.
    // Should throw an `ResourceTypeNotRegisteredError`.
    expect(() =>
      unregisterResourceType(core, resourceConfig, typeConfigsStore, {
        ...typeConfig,
        type: 'unregistered',
      }),
    ).toThrowError(ResourceTypeNotRegisteredError);
  });
});
