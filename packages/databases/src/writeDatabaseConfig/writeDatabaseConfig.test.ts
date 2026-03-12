import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { MockFs, cleanup, objectDatabase, setup } from '../test-utils';
import { databaseConfigFilePath } from '../utils';
import { writeDatabaseConfig } from './writeDatabaseConfig';

// Strip id and path from a database config (neither is persisted to disk)
const { id: _id, path: _path, ...expectedConfig } = objectDatabase;

describe('writeConfig', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('writes the database config to the file system', async () => {
    const path = databaseConfigFilePath(objectDatabase.path);

    // Remove the existing config file from the mock file system
    MockFs.removeFile(path);

    await writeDatabaseConfig(objectDatabase.id);

    expect(MockFs.readJsonFile(path)).toEqual(expectedConfig);
  });

  it('creates the hidden directory if it does not exist', async () => {
    // Remove the database's hidden .minddrop directory
    MockFs.removeDir(
      Fs.parentDirPath(databaseConfigFilePath(objectDatabase.path)),
    );

    await writeDatabaseConfig(objectDatabase.id);

    expect(MockFs.exists(databaseConfigFilePath(objectDatabase.path))).toBe(
      true,
    );
  });
});
