import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Sql } from '@minddrop/sql';
import { objectDatabase, objectEntry1SqlRecord } from '../test-utils';
import { createTestSqlAdapter } from '../test-utils/createTestSqlAdapter';
import { SCHEMA_SQL } from './schema';
import { sqlGetAllDatabases } from './sqlGetAllDatabases';
import { sqlGetEntrySyncRecords } from './sqlGetEntrySyncRecords';
import { sqlUpsertDatabase } from './sqlUpsertDatabase';
import { sqlUpsertEntries } from './sqlUpsertEntries';

describe('sqlUpsertDatabase', () => {
  beforeEach(() => {
    // Open an in-memory database and create the schema
    Sql.registerAdapter(createTestSqlAdapter());
    Sql.initialize();
    Sql.exec(SCHEMA_SQL);

    // Seed the database and one of its entries
    sqlUpsertDatabase(
      {
        id: objectDatabase.id,
        name: objectDatabase.name,
        path: objectDatabase.path,
        icon: '',
      },
      { silent: true },
    );
    sqlUpsertEntries(objectDatabase.id, [objectEntry1SqlRecord], {
      silent: true,
    });
  });

  afterEach(() => {
    Sql.close();
  });

  it('inserts the database record', () => {
    const databases = sqlGetAllDatabases();

    expect(databases).toEqual([
      {
        id: objectDatabase.id,
        name: objectDatabase.name,
        path: objectDatabase.path,
        icon: '',
      },
    ]);
  });

  it('updates an existing database record', () => {
    // Upsert the database again with changed metadata
    sqlUpsertDatabase(
      {
        id: objectDatabase.id,
        name: 'Renamed',
        path: '/workspace/Renamed',
        icon: 'icon',
      },
      { silent: true },
    );

    expect(sqlGetAllDatabases()).toEqual([
      {
        id: objectDatabase.id,
        name: 'Renamed',
        path: '/workspace/Renamed',
        icon: 'icon',
      },
    ]);
  });

  it('preserves the database entries', () => {
    // Upsert the database again, as a database config update does
    sqlUpsertDatabase(
      {
        id: objectDatabase.id,
        name: objectDatabase.name,
        path: objectDatabase.path,
        icon: 'icon',
      },
      { silent: true },
    );

    // The entries must survive, a replaced database row would
    // cascade delete them
    expect(sqlGetEntrySyncRecords(objectDatabase.id)).toHaveLength(1);
  });
});
