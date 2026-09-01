import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  objectEntry1,
  rootStorageDatabase,
  rootStorageEntry1,
  rootStorageEntry_empty_value,
  setup,
} from '../../test-utils';
import { resolveEntryPropertyFilePaths } from './resolveEntryPropertyFilePaths';

describe('resolveEntryPropertyFilePaths', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("returns the paths of the entry's file-based property files", () => {
    // The root storage entry has an Image property with a file value
    expect(resolveEntryPropertyFilePaths(rootStorageEntry1.id)).toEqual([
      `${rootStorageDatabase.path}/image.png`,
    ]);
  });

  it('skips file-based properties without a value', () => {
    // The empty value entry has no file property values
    expect(
      resolveEntryPropertyFilePaths(rootStorageEntry_empty_value.id),
    ).toEqual([]);
  });

  it('returns an empty array when there are no file-based properties', () => {
    // The object entry has only formatted-text and icon properties
    expect(resolveEntryPropertyFilePaths(objectEntry1.id)).toEqual([]);
  });
});
