import { describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  commonStorageDatabase,
  databaseDirPath,
  entryStorageDatabase,
  objectDatabase,
  propertyStorageDatabase,
  rootStorageDatabase,
} from '../../test-utils';
import { resolveDatabasePropertyDirs } from './resolveDatabasePropertyDirs';

const { workspace_1 } = WorkspaceFixtures;

describe('resolveDatabasePropertyDirs', () => {
  it('returns the shared directory for common storage', () => {
    // Common storage keeps all property files in one configured directory
    expect(
      resolveDatabasePropertyDirs(commonStorageDatabase, workspace_1.path),
    ).toEqual([
      `${databaseDirPath(commonStorageDatabase)}/${commonStorageDatabase.propertyFilesDir}`,
    ]);
  });

  it('returns a directory per file-based property for property storage', () => {
    // Property storage keeps each file-based property's files in its own dir
    expect(
      resolveDatabasePropertyDirs(propertyStorageDatabase, workspace_1.path),
    ).toEqual([
      `${databaseDirPath(propertyStorageDatabase)}/Image`,
      `${databaseDirPath(propertyStorageDatabase)}/File`,
    ]);
  });

  it('returns an empty array for root storage', () => {
    // Root storage keeps property files loose in the database root
    expect(
      resolveDatabasePropertyDirs(rootStorageDatabase, workspace_1.path),
    ).toEqual([]);
  });

  it('returns an empty array for entry storage', () => {
    // Entry storage keeps property files in per-entry subdirectories
    expect(
      resolveDatabasePropertyDirs(entryStorageDatabase, workspace_1.path),
    ).toEqual([]);
  });

  it('excludes non-file-based properties for property storage', () => {
    // The object database uses property storage but has no file-based properties
    expect(
      resolveDatabasePropertyDirs(objectDatabase, workspace_1.path),
    ).toEqual([]);
  });
});
