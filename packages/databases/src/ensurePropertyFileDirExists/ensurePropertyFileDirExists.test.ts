import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { i18n } from '@minddrop/i18n';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { PropertyFilesDirNameKey } from '../constants';
import {
  MockFs,
  cleanup,
  commonStorageDatabase,
  commonStorageEntry1,
  entryStorageDatabase,
  entryStorageEntry1,
  propertyStorageDatabase,
  propertyStorageEntry1,
  rootStorageDatabase,
  rootStorageEntry1,
  setup,
} from '../test-utils';
import { ensurePropertyFileDirExists } from './ensurePropertyFileDirExists';

describe('ensurePropertyFileDirExists', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates the property directory for property based storage', async () => {
    // Use a property whose directory does not exist yet
    await ensurePropertyFileDirExists(propertyStorageEntry1.id, 'Attachment');

    expect(MockFs.exists(`${propertyStorageDatabase.path}/Attachment`)).toBe(
      true,
    );
  });

  it('keeps an existing property directory for property based storage', async () => {
    // The Image property directory exists in the fixtures
    await ensurePropertyFileDirExists(propertyStorageEntry1.id, 'Image');

    expect(MockFs.exists(`${propertyStorageDatabase.path}/Image`)).toBe(true);
  });

  it('creates the common directory for common based storage', async () => {
    const commonDirPath = `${commonStorageDatabase.path}/${commonStorageDatabase.propertyFilesDir}`;

    // Remove the common directory created by the fixtures
    MockFs.removeDir(commonDirPath);

    await ensurePropertyFileDirExists(commonStorageEntry1.id, 'Image');

    expect(MockFs.exists(commonDirPath)).toBe(true);
  });

  it('falls back to the default common directory name', async () => {
    // Remove the configured common directory name
    DatabasesStore.update(commonStorageDatabase.id, {
      propertyFilesDir: undefined,
    });

    await ensurePropertyFileDirExists(commonStorageEntry1.id, 'Image');

    // The default localized directory name should be used
    expect(
      MockFs.exists(
        `${commonStorageDatabase.path}/${i18n.t(PropertyFilesDirNameKey)}`,
      ),
    ).toBe(true);
  });

  it('resolves when the entry directory exists for entry based storage', async () => {
    // The entry's directory exists in the fixtures
    await expect(
      ensurePropertyFileDirExists(entryStorageEntry1.id, 'Image'),
    ).resolves.toBeUndefined();
  });

  it('throws when the entry directory is missing for entry based storage', async () => {
    // Point the entry at a directory which does not exist
    DatabaseEntriesStore.update(entryStorageEntry1.id, {
      path: `${entryStorageDatabase.path}/Missing/Missing.md`,
    });

    await expect(
      ensurePropertyFileDirExists(entryStorageEntry1.id, 'Image'),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('creates no directories for root based storage', async () => {
    await ensurePropertyFileDirExists(rootStorageEntry1.id, 'Image');

    // Root storage keeps property files loose in the database root
    expect(MockFs.exists(`${rootStorageDatabase.path}/Image`)).toBe(false);
  });
});
