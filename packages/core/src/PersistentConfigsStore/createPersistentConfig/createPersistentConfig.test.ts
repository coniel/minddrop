import { afterEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { PersistentConfigsStore } from '../PersistentConfigsStore';
import { createPersistentConfig } from './createPersistentConfig';

initializeMockFileSystem();

describe('createPersistentConfig', () => {
  afterEach(() => {
    PersistentConfigsStore.clear();
  });

  it('loads the default config if config does not exist', () => {
    // Create a persistent config with a default value
    createPersistentConfig('test', { foo: 'bar' });

    // Should load default value into the persistent
    // configs store.
    expect(PersistentConfigsStore.get('test')).toEqual({
      id: 'test',
      values: { foo: 'bar' },
    });
  });

  it('does not load default config if config already exists', () => {
    // Load a config into the store
    PersistentConfigsStore.load([{ id: 'test', values: { foo: 'loaded' } }]);

    // Create a config with the same ID as the loaded one
    createPersistentConfig('test', { foo: 'default' });

    // Should not load default values into store
    expect(PersistentConfigsStore.get('test')).toEqual({
      id: 'test',
      values: { foo: 'loaded' },
    });
  });
});
