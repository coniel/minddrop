import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../../DatabasesStore';
import {
  cleanup,
  databaseDirPath,
  database_pdf,
  objectDatabase,
  parentDir,
  setup,
} from '../../test-utils';
import { findPathDatabase } from './findPathDatabase';

const { workspace_2 } = WorkspaceFixtures;

const objectDatabasePath = databaseDirPath(objectDatabase);

describe('findPathDatabase', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('finds the database containing a path', () => {
    expect(findPathDatabase(`${objectDatabasePath}/Dune.md`)).toEqual(
      objectDatabase,
    );
  });

  it("finds the database of its own directory's path", () => {
    expect(findPathDatabase(objectDatabasePath)).toEqual(objectDatabase);
  });

  it('does not match a sibling directory sharing a name prefix', () => {
    expect(
      findPathDatabase(`${objectDatabasePath} Archive/Dune.md`),
    ).toBeNull();
  });

  it("searches the given workspace's databases", () => {
    // A database only the second workspace has
    DatabasesStore.in(workspace_2.id).set(database_pdf);

    expect(
      findPathDatabase(
        `${workspace_2.path}/${database_pdf.path}/Dune.pdf`,
        workspace_2.path,
        workspace_2.id,
      ),
    ).toEqual(database_pdf);
    expect(
      findPathDatabase(
        `${workspace_2.path}/${objectDatabase.path}/Dune.md`,
        workspace_2.path,
        workspace_2.id,
      ),
    ).toBeNull();
  });

  it('returns null for a path in no database', () => {
    expect(findPathDatabase(`${parentDir}/Scratch/notes.txt`)).toBeNull();
  });
});
