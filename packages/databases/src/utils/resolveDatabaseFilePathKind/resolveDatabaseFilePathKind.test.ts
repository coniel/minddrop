import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { Paths } from '@minddrop/utils';
import {
  cleanup,
  databaseDirPath,
  entryStorageDatabase,
  entryTemplate1,
  entryTemplatesDatabase,
  objectDatabase,
  setup,
} from '../../test-utils';
import { resolveDatabaseConfigFilePath } from '../resolveDatabaseConfigFilePath';
import { resolveDatabaseDesignFilePath } from '../resolveDatabaseDesignFilePath';
import { resolveDatabaseMetadataDirPath } from '../resolveDatabaseMetadataDirPath';
import { resolveDatabaseViewFilePath } from '../resolveDatabaseViewFilePath';
import { resolveEntryMetadataFilePath } from '../resolveEntryMetadataFilePath';
import { resolveEntryTemplateConfigFilePath } from '../resolveEntryTemplateConfigFilePath';
import { resolveEntryTemplateDirPath } from '../resolveEntryTemplateDirPath';
import { resolveEntryTemplateFilePath } from '../resolveEntryTemplateFilePath';
import { resolveDatabaseFilePathKind } from './resolveDatabaseFilePathKind';

const { contentView_virtual_1 } = ContentViewFixtures;
const { ownedCardDesign_1 } = DesignFixtures;

const objectDatabasePath = databaseDirPath(objectDatabase);
const entryTemplatesDatabasePath = databaseDirPath(entryTemplatesDatabase);
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

  it('classifies the database directory and its hidden directory as the database', () => {
    [objectDatabasePath, objectHiddenPath].forEach((path) => {
      expect(resolveDatabaseFilePathKind(path, objectDatabase)).toEqual({
        kind: 'database',
      });
    });
  });

  it('classifies the database config', () => {
    expect(
      resolveDatabaseFilePathKind(
        resolveDatabaseConfigFilePath(objectDatabasePath),
        objectDatabase,
      ),
    ).toEqual({ kind: 'config' });
  });

  it("classifies a view file by its view's ID", () => {
    expect(
      resolveDatabaseFilePathKind(
        resolveDatabaseViewFilePath(
          objectDatabasePath,
          contentView_virtual_1.id,
        ),
        objectDatabase,
      ),
    ).toEqual({ kind: 'view', viewId: contentView_virtual_1.id });
  });

  it("classifies a design file by its design's ID", () => {
    expect(
      resolveDatabaseFilePathKind(
        resolveDatabaseDesignFilePath(objectDatabasePath, ownedCardDesign_1.id),
        objectDatabase,
      ),
    ).toEqual({ kind: 'design', designId: ownedCardDesign_1.id });
  });

  it("classifies an entry template's directory and config file by the template's ID", () => {
    [
      resolveEntryTemplateDirPath(
        entryTemplatesDatabasePath,
        entryTemplate1.id,
      ),
      resolveEntryTemplateConfigFilePath(
        entryTemplatesDatabasePath,
        entryTemplate1.id,
      ),
    ].forEach((path) => {
      expect(resolveDatabaseFilePathKind(path, entryTemplatesDatabase)).toEqual(
        { kind: 'entry-template', templateId: entryTemplate1.id },
      );
    });
  });

  it('classifies other paths in the hidden directory as app state', () => {
    [
      `${objectHiddenPath}/content-views`,
      `${objectHiddenPath}/content-views/notes.txt`,
      `${objectHiddenPath}/content-views/archive/view.json`,
      `${objectHiddenPath}/designs`,
      `${objectHiddenPath}/designs/notes.txt`,
      `${objectHiddenPath}/templates`,
      resolveEntryTemplateFilePath(
        objectDatabasePath,
        entryTemplate1.id,
        'template-image.png',
      ),
      `${objectHiddenPath}/history`,
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
