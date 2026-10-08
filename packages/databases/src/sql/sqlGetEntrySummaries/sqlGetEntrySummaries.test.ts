import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  WorkspaceFixtures,
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import {
  DatabaseFixtures,
  MockFs,
  cleanupTestSqlDatabase,
  setupTestSqlDatabase,
} from '../../test-utils';
import { SqlEntryRecord } from '../../types';
import { sqlUpsertDatabase } from '../sqlUpsertDatabase';
import { sqlUpsertEntries } from '../sqlUpsertEntries';
import { sqlGetEntrySummaries } from './sqlGetEntrySummaries';

const { workspace_1 } = WorkspaceFixtures;
const { objectDatabase, objectEntry1SqlRecord, urlDatabase } = DatabaseFixtures;

// Entry in the object database
const bookEntry: SqlEntryRecord = {
  ...objectEntry1SqlRecord,
  id: 'database-entry_book',
  path: 'Book.md',
  title: 'Book',
};

// Entry in the URL database
const linkEntry: SqlEntryRecord = {
  ...objectEntry1SqlRecord,
  id: 'database-entry_link',
  databaseId: urlDatabase.id,
  path: 'Link.md',
  title: 'Link',
};

describe('sqlGetEntrySummaries', () => {
  beforeEach(() => {
    // Load the workspace the SQL helpers target by default
    setupWorkspaceFixtures(MockFs, {
      loadWorkspaceFiles: false,
      loadWorkspacesConfig: false,
    });

    // Open an in-memory database and seed the entries
    setupTestSqlDatabase();
    sqlUpsertDatabase(objectDatabase, { silent: true });
    sqlUpsertDatabase(urlDatabase, { silent: true });
    sqlUpsertEntries(objectDatabase.id, [bookEntry], { silent: true });
    sqlUpsertEntries(urlDatabase.id, [linkEntry], { silent: true });
  });

  afterEach(() => {
    cleanupTestSqlDatabase();
    cleanupWorkspaceFixtures();
  });

  it('returns every entry', () => {
    expect(sqlGetEntrySummaries({}, workspace_1.id)).toEqual(
      expect.arrayContaining([
        {
          id: bookEntry.id,
          databaseId: objectDatabase.id,
          title: bookEntry.title,
        },
        {
          id: linkEntry.id,
          databaseId: urlDatabase.id,
          title: linkEntry.title,
        },
      ]),
    );
    expect(sqlGetEntrySummaries({}, workspace_1.id)).toHaveLength(2);
  });

  it("returns only the given database's entries", () => {
    expect(sqlGetEntrySummaries({ databaseId: urlDatabase.id })).toEqual([
      { id: linkEntry.id, databaseId: urlDatabase.id, title: linkEntry.title },
    ]);
  });
});
