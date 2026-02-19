import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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
  rootStorageEntry_empty_value,
  setup,
} from '../../test-utils';
import { getPropertyFilePath } from './getPropertyFilePath';

describe('getPropertyFilePath', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns null if the property does not have a value', () => {
    expect(
      getPropertyFilePath(rootStorageEntry_empty_value.id, 'Image'),
    ).toBeNull();
  });

  it('returns path for root based storage', () => {
    expect(getPropertyFilePath(rootStorageEntry1.id, 'Image')).toBe(
      `${rootStorageDatabase.path}/image.png`,
    );
  });

  it('returns path for common based storage', () => {
    expect(getPropertyFilePath(commonStorageEntry1.id, 'Image')).toBe(
      `${commonStorageDatabase.path}/${commonStorageDatabase.propertyFilesDir}/image.png`,
    );
  });

  it('returns path for property based storage', () => {
    expect(getPropertyFilePath(propertyStorageEntry1.id, 'Image')).toBe(
      `${propertyStorageDatabase.path}/Image/image.png`,
    );
  });

  it('returns path for entry based storage', () => {
    expect(getPropertyFilePath(entryStorageEntry1.id, 'Image')).toBe(
      `${entryStorageDatabase.path}/Entry Storage Entry 1/image.png`,
    );
  });
});
