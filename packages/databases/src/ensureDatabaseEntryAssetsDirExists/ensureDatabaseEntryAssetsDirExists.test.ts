import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { AssetsDirName } from '../constants';
import {
  MockFs,
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { ensureDatabaseEntryAssetsDirExists } from './ensureDatabaseEntryAssetsDirExists';

const entryTypeAssetsDirPath = Fs.concatPath(
  objectDatabase.path,
  Paths.hiddenDirName,
  AssetsDirName,
);

describe('ensureDatabaseEntryAssetsDirExists', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates the entry type assets directory if it does not exist', async () => {
    await ensureDatabaseEntryAssetsDirExists(objectEntry1.id);

    expect(MockFs.exists(entryTypeAssetsDirPath)).toBe(true);
  });

  it("creates the entry's assets directory if it does not exist", async () => {
    await ensureDatabaseEntryAssetsDirExists(objectEntry1.id);

    const path = Fs.concatPath(entryTypeAssetsDirPath, objectEntry1.title);

    expect(MockFs.exists(path)).toBe(true);
  });
});
