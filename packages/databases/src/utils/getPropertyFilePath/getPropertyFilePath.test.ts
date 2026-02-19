import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabasesStore } from '../../DatabasesStore';
import {
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
} from '../../test-utils';
import { getPropertyFilePath } from './getPropertyFilePath';

describe('getPropertyFilePath', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns path for root based storage', () => {
    expect(
      getPropertyFilePath(rootStorageEntry1.id, 'Image', 'image.png'),
    ).toBe(`${rootStorageDatabase.path}/image.png`);
  });

  it('returns path for common based storage', () => {
    expect(
      getPropertyFilePath(commonStorageEntry1.id, 'Image', 'image.png'),
    ).toBe(
      `${commonStorageDatabase.path}/${commonStorageDatabase.propertyFilesDir}/image.png`,
    );
  });

  it('returns path for property based storage', () => {
    expect(
      getPropertyFilePath(propertyStorageEntry1.id, 'Image', 'image.png'),
    ).toBe(`${propertyStorageDatabase.path}/Image/image.png`);
  });

  it('returns path for entry based storage', () => {
    expect(
      getPropertyFilePath(entryStorageEntry1.id, 'Image', 'image.png'),
    ).toBe(`${entryStorageDatabase.path}/Entry Storage Entry 1/image.png`);
  });

  it('defaults to root based storage if no storage is provided', () => {
    // Remove the property file storage from database
    DatabasesStore.update(commonStorageDatabase.id, {
      propertyFileStorage: undefined,
    });

    expect(
      getPropertyFilePath(rootStorageEntry1.id, 'Image', 'image.png'),
    ).toBe(`${rootStorageDatabase.path}/image.png`);
  });
});
