import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  cleanup,
  cleanupTestSqlDatabase,
  collectionDatabase,
  connectTestSqlWorkspace,
  database_pdf,
  entrySqlRecords,
  objectDatabase,
  objectEntry1,
  relatedEntry1,
  relatedEntry1SqlRecord,
  seedSqlDatabases,
  seedSqlEntries,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { sqlUpsertDatabase } from '../sqlUpsertDatabase';
import { sqlUpsertEntries } from '../sqlUpsertEntries';
import { sqlGetEntryIdsByAddress } from './sqlGetEntryIdsByAddress';

const { workspace_2 } = WorkspaceFixtures;

// The address keys of fixture entries. Their database name and title,
// lowercased.
const relatedEntry1AddressKey =
  `${collectionDatabase.name}/${relatedEntry1.title}`.toLowerCase();
const objectEntry1AddressKey =
  `${objectDatabase.name}/${objectEntry1.title}`.toLowerCase();

describe('sqlGetEntryIdsByAddress', () => {
  beforeEach(() => {
    setup();
    setupTestSqlDatabase();
    seedSqlDatabases();
    seedSqlEntries();
  });

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it("indexes an entry's ID under its database name and title, lowercased", () => {
    const entryIdByAddress = sqlGetEntryIdsByAddress();

    expect(entryIdByAddress.get(relatedEntry1AddressKey)).toBe(
      relatedEntry1.id,
    );
    expect(entryIdByAddress.get(objectEntry1AddressKey)).toBe(objectEntry1.id);
  });

  it('indexes every indexed entry', () => {
    const entryIdByAddress = sqlGetEntryIdsByAddress();

    expect([...entryIdByAddress.values()].sort()).toEqual(
      entrySqlRecords.map((record) => record.id).sort(),
    );
  });

  it("indexes the given workspace's entries", () => {
    // Index a database with one entry in a second workspace only
    connectTestSqlWorkspace(workspace_2.id);
    sqlUpsertDatabase(database_pdf, { silent: true }, workspace_2.id);
    sqlUpsertEntries(
      database_pdf.id,
      [{ ...relatedEntry1SqlRecord, databaseId: database_pdf.id }],
      { silent: true },
      workspace_2.id,
    );

    expect(sqlGetEntryIdsByAddress(workspace_2.id)).toEqual(
      new Map([
        [
          `${database_pdf.name}/${relatedEntry1.title}`.toLowerCase(),
          relatedEntry1.id,
        ],
      ]),
    );
  });
});
