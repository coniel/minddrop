import { describe, it, expect, beforeEach } from 'vitest';
import {
  initializeMockFileSystem,
  ConfigsFile,
  ConfigsFileOptions,
} from '@minddrop/file-system';
import { persistConfigs } from './persistConfigs';
import { PersistentConfigsStore } from '../PersistentConfigsStore';

const CONFIGS = [
  { id: 'test-config-1', values: { foo: 'bar' } },
  { id: 'test-config-2', values: { bar: 'foo' } },
];

const MockFs = initializeMockFileSystem([
  {
    path: ConfigsFile,
    options: ConfigsFileOptions,
  },
]);

describe('persistConfig', () => {
  beforeEach(() => {
    // Reset mock file system
    MockFs.reset();
  });

  it('writes the configs to "configs.json"', async () => {
    // Load configs
    PersistentConfigsStore.load(CONFIGS);

    // Perist the config
    await persistConfigs();

    // Get the persisted configs
    const configs = JSON.parse(
      MockFs.readTextFile(ConfigsFile, ConfigsFileOptions),
    );

    // Persisted configs should contain configs data
    expect(configs).toEqual({
      'test-config-1': { foo: 'bar' },
      'test-config-2': { bar: 'foo' },
    });
  });
});
