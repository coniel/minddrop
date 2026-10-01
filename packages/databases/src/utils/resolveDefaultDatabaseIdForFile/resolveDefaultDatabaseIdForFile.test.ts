import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setDatabaseContentDefault } from '../../setDatabaseContentDefault';
import {
  cleanup,
  commonStorageDatabase,
  customContentType_file_1,
  objectDatabase,
  propertyStorageDatabase,
  rootStorageDatabase,
  setup,
} from '../../test-utils';
import { updateCustomContentType } from '../../updateCustomContentType';
import { resolveDefaultDatabaseIdForFile } from './resolveDefaultDatabaseIdForFile';

// A file name with an extension the custom file type lists
const customTypeFileName = `model.${customContentType_file_1.matchers[0].toUpperCase()}`;

describe('resolveDefaultDatabaseIdForFile', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('prefers the custom content type listing the extension', () => {
    // Set the custom type's database and the catch-all file default
    updateCustomContentType(customContentType_file_1.id, {
      databaseId: rootStorageDatabase.id,
    });
    setDatabaseContentDefault('file', commonStorageDatabase.id);

    expect(resolveDefaultDatabaseIdForFile(customTypeFileName)).toBe(
      rootStorageDatabase.id,
    );
  });

  it('falls back to the content type default', () => {
    setDatabaseContentDefault('image', commonStorageDatabase.id);
    setDatabaseContentDefault('file', propertyStorageDatabase.id);

    expect(resolveDefaultDatabaseIdForFile('photo.png')).toBe(
      commonStorageDatabase.id,
    );
  });

  it('falls back to the catch-all file default', () => {
    setDatabaseContentDefault('file', propertyStorageDatabase.id);

    expect(resolveDefaultDatabaseIdForFile('photo.png')).toBe(
      propertyStorageDatabase.id,
    );
  });

  it('falls back when the custom content type has no database', () => {
    // Set the catch-all file default
    setDatabaseContentDefault('file', propertyStorageDatabase.id);

    expect(resolveDefaultDatabaseIdForFile(customTypeFileName)).toBe(
      propertyStorageDatabase.id,
    );
  });

  it('returns null when no default applies', () => {
    expect(resolveDefaultDatabaseIdForFile('photo.png')).toBeNull();
  });

  it('prefers a target database which can hold the file over the defaults', () => {
    setDatabaseContentDefault('image', commonStorageDatabase.id);

    expect(
      resolveDefaultDatabaseIdForFile('photo.png', rootStorageDatabase.id),
    ).toBe(rootStorageDatabase.id);
  });

  it('ignores a target database which cannot hold the file', () => {
    setDatabaseContentDefault('image', commonStorageDatabase.id);

    expect(
      resolveDefaultDatabaseIdForFile('photo.png', objectDatabase.id),
    ).toBe(commonStorageDatabase.id);
  });

  it('ignores a target database which does not exist', () => {
    setDatabaseContentDefault('image', commonStorageDatabase.id);

    expect(
      resolveDefaultDatabaseIdForFile('photo.png', 'missing-database'),
    ).toBe(commonStorageDatabase.id);
  });
});
