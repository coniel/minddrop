import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Paths } from '@minddrop/utils';
import {
  cleanup,
  databaseDirPath,
  entryStorageDatabase,
  objectDatabase,
  setup,
} from '../../test-utils';
import { resolveDatabaseConfigFilePath } from '../resolveDatabaseConfigFilePath';
import { resolveDatabaseMetadataDirPath } from '../resolveDatabaseMetadataDirPath';
import { resolveEntryMetadataFilePath } from '../resolveEntryMetadataFilePath';
import { resolveDatabaseFilePathKind } from './resolveDatabaseFilePathKind';

const objectDatabasePath = databaseDirPath(objectDatabase);
const objectHiddenPath = `${objectDatabasePath}/${Paths.hiddenDirName}`;
const objectMetadataPath = resolveDatabaseMetadataDirPath(objectDatabasePath);
const entryStorageDatabasePath = databaseDirPath(entryStorageDatabase);

describe('resolveDatabaseFilePathKind', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('classifies an entry file at the database root', () => {
    expect(
      resolveDatabaseFilePathKind(
        `${objectDatabasePath}/Dune.md`,
        objectDatabase,
      ),
    ).toEqual({ kind: 'entry', entryPath: 'Dune.md' });
  });

  it("classifies an entry file in an entry's own directory", () => {
    expect(
      resolveDatabaseFilePathKind(
        `${entryStorageDatabasePath}/Dune/Dune.md`,
        entryStorageDatabase,
      ),
    ).toEqual({ kind: 'entry', entryPath: 'Dune/Dune.md' });
  });

  it('does not classify a nested file as an entry in a database storing entries at its root', () => {
    expect(
      resolveDatabaseFilePathKind(
        `${objectDatabasePath}/Notes/Dune.md`,
        objectDatabase,
      ),
    ).toEqual({ kind: 'other' });
  });

  it('does not classify a nested file as an entry deeper than an entry directory', () => {
    expect(
      resolveDatabaseFilePathKind(
        `${entryStorageDatabasePath}/Dune/Notes/Dune.md`,
        entryStorageDatabase,
      ),
    ).toEqual({ kind: 'other' });
  });

  it('does not classify a dot-prefixed file or directory as an entry', () => {
    expect(
      resolveDatabaseFilePathKind(
        `${objectDatabasePath}/.Dune.md`,
        objectDatabase,
      ),
    ).toEqual({ kind: 'other' });
    expect(
      resolveDatabaseFilePathKind(
        `${entryStorageDatabasePath}/.Dune/Dune.md`,
        entryStorageDatabase,
      ),
    ).toEqual({ kind: 'other' });
  });

  it("does not classify a file of another type than the database's entries as an entry", () => {
    expect(
      resolveDatabaseFilePathKind(
        `${objectDatabasePath}/Cover.png`,
        objectDatabase,
      ),
    ).toEqual({ kind: 'other' });
  });

  it('classifies a metadata sidecar by its key', () => {
    expect(
      resolveDatabaseFilePathKind(
        resolveEntryMetadataFilePath(objectDatabasePath, 'Dune.md'),
        objectDatabase,
      ),
    ).toEqual({ kind: 'metadata', metadataKey: 'Dune' });
  });

  it('classifies the database directory, its hidden directory and its config', () => {
    [
      objectDatabasePath,
      objectHiddenPath,
      resolveDatabaseConfigFilePath(objectDatabasePath),
    ].forEach((path) => {
      expect(resolveDatabaseFilePathKind(path, objectDatabase)).toEqual({
        kind: 'database',
      });
    });
  });

  it('classifies other paths in the hidden directory as app state', () => {
    [
      `${objectHiddenPath}/content-views/view.json`,
      `${objectHiddenPath}/designs/design.json`,
      `${objectHiddenPath}/history/log.json`,
      objectMetadataPath,
      `${objectMetadataPath}/Dune.txt`,
      `${objectMetadataPath}/Notes/Dune.json`,
    ].forEach((path) => {
      expect(resolveDatabaseFilePathKind(path, objectDatabase)).toEqual({
        kind: 'app-state',
      });
    });
  });
});
