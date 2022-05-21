import { RegisteredResourceTypeConfig } from '../types';
import { createConfigsStore } from '../createConfigsStore';
import { getAllResourceTypeConfigs } from './getAllResourceTypeConfigs';

// Create a test resource type configs store
const typeConfigsStore = createConfigsStore<RegisteredResourceTypeConfig>({
  idField: 'type',
});

// Schema for the type configs
const dataSchema = {
  foo: {
    type: 'string',
  },
};

// Create a couple of resource type configs, each
// with a different type and extension ID.
const config1 = {
  extension: 'extension-1',
  type: 'type-1',
  dataSchema,
};
const config2 = {
  extension: 'extension-2',
  type: 'type-2',
  dataSchema,
};

// Register the test resource type configs
typeConfigsStore.register([config1, config2]);

describe('getAllResourceTypeConfigs', () => {
  it('returns all registered resource type configs', () => {
    // Get all resource type configs
    const configs = getAllResourceTypeConfigs(typeConfigsStore);

    // Should return all configs
    expect(configs).toEqual([config1, config2]);
  });

  it('filters configs by type', () => {
    // Get 'type-1' resource configs
    const configs = getAllResourceTypeConfigs(typeConfigsStore, {
      type: ['type-1'],
    });

    // Should return only 'type-1' configs
    expect(configs).toEqual([config1]);
  });

  it('filters configs by extension', () => {
    // Get 'extension-1' resource configs
    const configs = getAllResourceTypeConfigs(typeConfigsStore, {
      extension: ['extension-1'],
    });

    // Should return only 'extension-1' configs
    expect(configs).toEqual([config1]);
  });
});
