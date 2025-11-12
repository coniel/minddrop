import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { MockFs, cleanup, objectDatabase, setup } from '../test-utils';
import { databaseConfigFilePath } from '../utils';
import { writeDatabaseConfig } from './writeDatabaseConfig';

describe('writeConfig', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('should write the database config to the file system', async () => {
    const path = databaseConfigFilePath(objectDatabase.path);

    // Remove the existing config file from the mock file system
    MockFs.removeFile(path);

    await writeDatabaseConfig(objectDatabase.name);

    const config = {
      ...objectDatabase,
      created: objectDatabase.created.toISOString(),
    };

    // Should remove the path before serialization
    delete config.path;

    expect(MockFs.readJsonFile(path)).toEqual(config);
  });

  it('creates the hidden directory if it does not exist', async () => {
    // Remove the database's hidden .minddrop directory
    MockFs.removeDir(
      Fs.parentDirPath(databaseConfigFilePath(objectDatabase.path)),
    );

    await writeDatabaseConfig(objectDatabase.name);

    expect(MockFs.exists(databaseConfigFilePath(objectDatabase.path))).toBe(
      true,
    );
  });
});
