import { describe, expect, it } from 'vitest';
import {
  commonStorageDatabase,
  entryStorageDatabase,
  objectDatabase,
  propertyStorageDatabase,
  rootStorageDatabase,
} from '../../test-utils';
import { resolveDatabasePropertyDirs } from './resolveDatabasePropertyDirs';

describe('resolveDatabasePropertyDirs', () => {
  it('returns the shared directory for common storage', () => {
    // Common storage keeps all property files in one configured directory
    expect(resolveDatabasePropertyDirs(commonStorageDatabase)).toEqual([
      `${commonStorageDatabase.path}/${commonStorageDatabase.propertyFilesDir}`,
    ]);
  });

  it('returns a directory per file-based property for property storage', () => {
    // Property storage keeps each file-based property's files in its own dir
    expect(resolveDatabasePropertyDirs(propertyStorageDatabase)).toEqual([
      `${propertyStorageDatabase.path}/Image`,
      `${propertyStorageDatabase.path}/File`,
    ]);
  });

  it('returns an empty array for root storage', () => {
    // Root storage keeps property files loose in the database root
    expect(resolveDatabasePropertyDirs(rootStorageDatabase)).toEqual([]);
  });

  it('returns an empty array for entry storage', () => {
    // Entry storage keeps property files in per-entry subdirectories
    expect(resolveDatabasePropertyDirs(entryStorageDatabase)).toEqual([]);
  });

  it('excludes non-file-based properties for property storage', () => {
    // The object database uses property storage but has no file-based properties
    expect(resolveDatabasePropertyDirs(objectDatabase)).toEqual([]);
  });
});
