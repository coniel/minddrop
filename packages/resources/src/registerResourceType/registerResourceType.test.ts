import { core } from '../test-utils';
import {
  TypedResourceConfig,
  ResourceTypeConfig,
  TRDTypeDataSchema,
  RegisteredResourceTypeConfig,
} from '../types';
import { InvalidResourceSchemaError } from '../errors';
import { createConfigsStore } from '../createConfigsStore';
import { registerResourceType } from './registerResourceType';

interface Data {
  foo: string;
}

const schema: TRDTypeDataSchema<{}, Data> = {
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
const typeConfigsStore = createConfigsStore<
  RegisteredResourceTypeConfig<{}, Data>
>({
  idField: 'type',
});

const typeConfig: ResourceTypeConfig<{}, Data> = {
  type: 'test',
  dataSchema: schema,
};

describe('registerResourceType', () => {
  it('adds the config to the type configs store', () => {
    // Register a new resource type
    registerResourceType(core, resourceConfig, typeConfigsStore, typeConfig);

    // Config should be in the type configs store
    expect(typeConfigsStore.get('test')).toBeDefined();
  });

  it('adds the extension ID to the config', () => {
    // Register a new resource type
    registerResourceType(core, resourceConfig, typeConfigsStore, typeConfig);

    // Store config should contain extension ID
    expect(typeConfigsStore.get('test')).toEqual({
      ...typeConfig,
      extension: core.extensionId,
    });
  });

  it('dispatches a `[resource]:register` event', (done) => {
    // Listen to `tests:test:register` events
    core.addEventListener('tests:test:register', (payload) => {
      // Payload data should be the type config
      expect(payload.data).toEqual({
        ...typeConfig,
        extension: core.extensionId,
      });
      done();
    });

    // Register a new resource type
    registerResourceType(core, resourceConfig, typeConfigsStore, typeConfig);
  });

  it('validates the data schema', () => {
    // Create a resource type config with an invalid data schema
    const invalidSchemaConfig: ResourceTypeConfig<{}, Data> = {
      type: 'test',
      // @ts-ignore
      dataSchema: { foo: {} },
    };
    // Register a resource type using an invalid data schema.
    // Should throw an `InvalidResourceSchemaError`.
    expect(() =>
      registerResourceType(
        core,
        resourceConfig,
        typeConfigsStore,
        invalidSchemaConfig,
      ),
    ).toThrowError(InvalidResourceSchemaError);
  });
});
