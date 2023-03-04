import { describe, it, expect, beforeEach } from 'vitest';
import { MockFsAdapter } from '../../test-utils';
import { registerFileSystemAdapter } from '../../FileSystem';
import { persistConfigs } from './persistConfigs';
import { PersistentConfigsStore } from '../PersistentConfigsStore';
import { ConfigsFile, ConfigsFileOptions } from '../../constants';

describe('persistConfig', () => {
  beforeEach(() => {
    registerFileSystemAdapter(MockFsAdapter);
  });

  it('writes the config to "configs.json"', () => {
    // Load a config
    PersistentConfigsStore.load([
      { id: 'test-config-1', values: { foo: 'bar' } },
      { id: 'test-config-2', values: { bar: 'foo' } },
    ]);

    // Perist the config
    persistConfigs();

    // Should write configs to 'configs.json'
    expect(MockFsAdapter.writeTextFile).toHaveBeenCalledWith(
      ConfigsFile,
      JSON.stringify({
        'test-config-1': { foo: 'bar' },
        'test-config-2': { bar: 'foo' },
      }),
      ConfigsFileOptions,
    );
  });
});
