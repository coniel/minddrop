import { afterEach, describe, expect, it } from 'vitest';
import { BaseDirectory } from '@minddrop/file-system';
import { DatabasesStore } from '../DatabasesStore';
import { DatabasesConfigFileName } from '../constants';
import { MockFs, cleanup, databases, objectDatabase } from '../test-utils';
import { DatabasesConfig } from '../types';
import { initializeDatabases } from './initializeDatabases';

describe('initializeDatabases', () => {
  afterEach(cleanup);

  it('loads databases into the store', async () => {
    await initializeDatabases();

    expect(DatabasesStore.getAll()).toEqual(databases);
  });

  it('creates the databases config file if it does not exist', async () => {
    MockFs.removeFile(DatabasesConfigFileName, {
      baseDir: BaseDirectory.AppConfig,
    });

    await initializeDatabases();

    expect(
      MockFs.exists(DatabasesConfigFileName, {
        baseDir: BaseDirectory.AppConfig,
      }),
    ).toBe(true);
  });
});
