import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { omitPath } from '@minddrop/utils';
import { MockFs, cleanup, objectDatabase, setup } from '../test-utils';
import { databaseConfigFilePath } from '../utils';
import { writeDatabaseConfig } from './writeDatabaseConfig';

describe('writeConfig', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('writes the database config to the file system', async () => {
    const path = databaseConfigFilePath(objectDatabase.path);

    // Remove the existing config file from the mock file system
    MockFs.removeFile(path);

    await writeDatabaseConfig(objectDatabase.id);

    expect(MockFs.readJsonFile(path)).toEqual(omitPath(objectDatabase));
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
