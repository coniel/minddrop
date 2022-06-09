import { getTypedResourceTypeConfig } from './getTypedResourceTypeConfig';
import { ResourceTypeNotRegisteredError } from '../errors';
import { ResourceTypeConfig } from '../types';
import { createConfigsStore } from '../createConfigsStore';

// Create a test resource type configs store
const typeConfigsStore = createConfigsStore<ResourceTypeConfig>({
  idField: 'type',
});

const dataSchema = {
  foo: {
    type: 'string',
  },
};

const testConfig = {
  type: 'test-type',
  dataSchema,
};

typeConfigsStore.register(testConfig);

describe('getTypedResourceTypeConfig', () => {
  it('throws if the type is not registered', () => {
    // Attempt to get a type that is not registered.
    // Should throw a `ResourceTypeNotRegisteredError`.
    expect(() =>
      getTypedResourceTypeConfig(
        'tests:test',
        typeConfigsStore,
        'unregistered',
      ),
    ).toThrowError(ResourceTypeNotRegisteredError);
  });

  it('returns the requested type config', () => {
    // Get the 'test-type' config
    const config = getTypedResourceTypeConfig(
      'tests:test',
      typeConfigsStore,
      'test-type',
    );

    // Should return the requested config
    expect(config).toEqual(testConfig);
  });
});
