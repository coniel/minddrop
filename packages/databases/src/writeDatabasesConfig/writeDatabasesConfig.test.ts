import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BaseDirectory } from '@minddrop/file-system';
import { DatabasesStore } from '../DatabasesStore';
import { DatabasesConfigFileName } from '../constants';
import { MockFs, cleanup, databases, setup } from '../test-utils';
import { writeDatabasesConfig } from './writeDatabasesConfig';

describe('writeDatabasesConfig', () => {
  beforeEach(() => {
    setup();

    // Delete the existing config file to start fresh
    MockFs.removeFile(DatabasesConfigFileName, {
      baseDir: BaseDirectory.AppConfig,
    });
  });

  afterEach(cleanup);

  it('creates an empty config file if it does not exist', async () => {
    // Clear the databases store to simulate no databases
    DatabasesStore.clear();

    await writeDatabasesConfig();

    expect(
      MockFs.readJsonFile(DatabasesConfigFileName, {
        baseDir: BaseDirectory.AppConfig,
      }),
    ).toEqual({ paths: [] });
  });

  it('writes database paths to the config file', async () => {
    await writeDatabasesConfig();

    expect(
      MockFs.readJsonFile(DatabasesConfigFileName, {
        baseDir: BaseDirectory.AppConfig,
      }),
    ).toEqual({
      paths: databases.map((db) => ({ id: db.id, path: db.path })),
    });
  });
});
