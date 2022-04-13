import { ConfigStore } from '../types';
import { createConfigsStore } from './createConfigsStore';

const config1 = {
  type: 'type-1',
};
const config2 = {
  type: 'type-2',
};

describe('configsStore', () => {
  let Store: ConfigStore<{ type: string }>;

  beforeEach(() => {
    Store = createConfigsStore({ idField: 'type' });
  });

  describe('add', () => {
    it('adds a config to the store', () => {
      // Add a config to the store
      Store.register(config1);

      // Config should be in the store
      expect(Store.get(config1.type)).toEqual(config1);
    });

    it('adds multiple configs to the store', () => {
      // Add multiple configs to the store
      Store.register([config1, config2]);

      // Configs should be in the store
      expect(Store.get(config1.type)).toEqual(config1);
      expect(Store.get(config2.type)).toEqual(config2);
    });

    it('preserves existing configs', () => {
      // Add a config to the store
      Store.register([config1]);
      // Add a second config to the store
      Store.register([config2]);

      // Store should contain both configs in the order
      // they were added.
      expect(Store.getAll()).toEqual([config1, config2]);
    });
  });

  describe('remove', () => {
    it('removes a config from the store', () => {
      // Add configs to the store
      Store.register([config1, config2]);

      // Remove a config from the store
      Store.unregister(config1);

      // Config should be removed from the store
      expect(Store.getAll()).toEqual([config2]);
    });

    it('removes multiple configs from the store', () => {
      // Add configs to the store
      Store.register([config1, config2]);

      // Remove a config from the store
      Store.unregister([config1, config2]);

      // Configs should be removed from the store
      expect(Store.getAll()).toEqual([]);
    });
  });

  describe('get', () => {
    it('returns a single config provided a single ID field value', () => {
      // Add configs to the store
      Store.register([config1, config2]);

      // Returns the requested config
      expect(Store.get(config1.type)).toEqual(config1);
    });

    it('returns multiple configs in addition order provided an array of ID field values', () => {
      // Add configs to the store
      Store.register(config1);
      Store.register(config2);

      // Returns the requested configs in the order
      // they were added.
      expect(Store.get([config2.type, config1.type])).toEqual([
        config1,
        config2,
      ]);
    });
  });

  describe('getAll', () => {
    it('returns all configs from the store sorted by addition order', () => {
      // Add configs to the store
      Store.register(config1);
      Store.register(config2);

      // Returns all configs in the store in the order
      // in which they were added.
      expect(Store.getAll()).toEqual([config1, config2]);
    });
  });

  describe('clear', () => {
    it('clears all configs from the store', () => {
      // Add configs to the store
      Store.register([config1, config2]);

      // Clear the store
      Store.clear();

      // Configs should no longer be in the store
      expect(Store.get([config1.type, config2.type])).toEqual([]);
    });
  });
});
