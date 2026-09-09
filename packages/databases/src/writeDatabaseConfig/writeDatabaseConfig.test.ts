import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../test-utils';
import { resolveDatabaseConfigFilePath, serializeDatabase } from '../utils';
import { writeDatabaseConfig } from './writeDatabaseConfig';

// The config as it is stored, without the fields derived at load time
const expectedConfig = serializeDatabase(objectDatabase);

describe('writeConfig', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('writes the database config to the file system', async () => {
    const path = resolveDatabaseConfigFilePath(databaseDirPath(objectDatabase));

    // Remove the existing config file from the mock file system
    MockFs.removeFile(path);

    await writeDatabaseConfig(objectDatabase.id);

    expect(MockFs.readJsonFile(path)).toEqual(expectedConfig);
  });

  it('creates the hidden directory if it does not exist', async () => {
    // Remove the database's hidden .minddrop directory
    MockFs.removeDir(
      Fs.parentDirPath(
        resolveDatabaseConfigFilePath(databaseDirPath(objectDatabase)),
      ),
    );

    await writeDatabaseConfig(objectDatabase.id);

    expect(
      MockFs.exists(
        resolveDatabaseConfigFilePath(databaseDirPath(objectDatabase)),
      ),
    ).toBe(true);
  });
});
