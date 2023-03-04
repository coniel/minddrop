import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { MockFsAdapter } from '../../test-utils';
import { registerFileSystemAdapter } from '../../FileSystem';
import { loadConfigs } from './loadConfigs';
import { PersistentConfigsStore } from '../PersistentConfigsStore';

const testConfigs = {
  'test-config-1': {
    foo: 'bar',
  },
  'test-config-2': {
    bar: 'foo',
  },
};

describe('loadConfigs', () => {
  const exists = vi.fn();
  const readTextFile = vi.fn();

  beforeEach(() => {
    registerFileSystemAdapter({ ...MockFsAdapter, exists, readTextFile });
  });

  afterEach(() => {
    PersistentConfigsStore.clear();
  });

  it('does nothing if the configs.json file does not exist', async () => {
    // Mock that the 'configs.json' file does not exists
    exists.mockResolvedValue(false);

    // Throw an error when attempting to read the file
    readTextFile.mockRejectedValue({});

    // Load the configs
    await loadConfigs();

    // Configs store should be empty
    expect(PersistentConfigsStore.getAll()).toEqual({});
  });

  it('loads the configs from app data "configs.json" file', async () => {
    // Mock that the 'configs.json' file exists
    exists.mockResolvedValue(true);

    // Return a stringified version of the test config when reading
    // the configs.json file.
    readTextFile.mockResolvedValue(JSON.stringify(testConfigs));

    // Load the configs
    await loadConfigs();

    // Should load the configs into the store
    expect(PersistentConfigsStore.getAll()).toEqual({
      'test-config-1': {
        id: 'test-config-1',
        values: testConfigs['test-config-1'],
      },
      'test-config-2': {
        id: 'test-config-2',
        values: testConfigs['test-config-2'],
      },
    });
  });

  it('does nothing if configs.json file cannot be parsed', async () => {
    // Mock that the 'configs.json' file exists
    exists.mockResolvedValue(true);

    // Return invalid JSON when reading the configs.json file
    readTextFile.mockResolvedValue('abc');

    // Load the configs
    await loadConfigs();

    // Should load the configs into the store
    expect(PersistentConfigsStore.getAll()).toEqual({});
  });
});
