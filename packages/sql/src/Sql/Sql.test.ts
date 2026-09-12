import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { createTestSqlAdapter } from '../test-utils';
import * as Sql from './Sql';

// Mock file system backing database file tracking in tests
const MockFs = initializeMockFileSystem();

// Workspace the test database belongs to
const WORKSPACE_ID = 'workspace-1';

// Path of the test database file
const DATABASE_PATH = 'AppData/test.sql';

// Schema used to create test databases
const SCHEMA = `
  CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT);
  CREATE TABLE items (id TEXT PRIMARY KEY, label TEXT);
`;

// A row from the items table
interface ItemRow {
  id: string;
  label: string;
}

describe('Sql', () => {
  beforeEach(() => {
    // Reset the mock file system contents
    MockFs.reset();

    // Register a fresh path-keyed test adapter
    Sql.registerAdapter(createTestSqlAdapter(MockFs));
  });

  afterEach(() => {
    // Close the connections opened during the test
    Sql.closeAll();
  });

  describe('open', () => {
    it('creates a fresh database from the schema', async () => {
      // Open a database at a path with no existing database
      const result = await openDatabase();

      // Should report the schema as changed
      expect(result.schemaChanged).toBe(true);

      // Should have created the schema tables
      insertItem('item-1', 'Item 1');
      expect(Sql.all(WORKSPACE_ID, 'SELECT * FROM items')).toHaveLength(1);
    });

    it('stores the schema version and data version counter', async () => {
      // Open a fresh database
      await openDatabase(3);

      // Should store the provided schema version
      expect(
        Sql.get(
          WORKSPACE_ID,
          "SELECT value FROM meta WHERE key = 'schema_version'",
        ),
      ).toEqual({ value: '3' });

      // Should initialize the data version counter
      expect(
        Sql.get(WORKSPACE_ID, "SELECT value FROM meta WHERE key = 'version'"),
      ).toEqual({
        value: '0',
      });
    });

    it('reuses the existing database when the schema version matches', async () => {
      // Open a fresh database and add a row
      await openDatabase();
      insertItem('item-1', 'Item 1');

      // Reopen the database with the same schema version
      const result = await openDatabase();

      // Should report the schema as unchanged
      expect(result.schemaChanged).toBe(false);

      // Should have preserved the existing data
      expect(Sql.get<ItemRow>(WORKSPACE_ID, 'SELECT * FROM items')).toEqual({
        id: 'item-1',
        label: 'Item 1',
      });
    });

    it('rebuilds the database when the schema version does not match', async () => {
      // Open a fresh database and add a row
      await openDatabase(1);
      insertItem('item-1', 'Item 1');

      // Reopen the database with a different schema version
      const result = await openDatabase(2);

      // Should report the schema as changed
      expect(result.schemaChanged).toBe(true);

      // Should have dropped the old data
      expect(Sql.all(WORKSPACE_ID, 'SELECT * FROM items')).toHaveLength(0);

      // Should store the new schema version
      expect(
        Sql.get(
          WORKSPACE_ID,
          "SELECT value FROM meta WHERE key = 'schema_version'",
        ),
      ).toEqual({ value: '2' });
    });

    it('keeps a separate database per workspace', async () => {
      // Open a database for each of two workspaces
      await openDatabase();
      await Sql.open('workspace-2', 'AppData/other.sql', {
        schema: SCHEMA,
        version: 1,
      });

      // Add a row to the first workspace's database
      insertItem('item-1', 'Item 1');

      // The second workspace's database should not have the row
      expect(Sql.all('workspace-2', 'SELECT * FROM items')).toHaveLength(0);
    });

    it('removes the WAL and SHM files when rebuilding', async () => {
      // Open a fresh database
      await openDatabase(1);

      // Add WAL and SHM files alongside the database file
      MockFs.writeTextFile(`${DATABASE_PATH}-wal`, '');
      MockFs.writeTextFile(`${DATABASE_PATH}-shm`, '');

      // Reopen the database with a different schema version
      await openDatabase(2);

      // Should have removed the WAL and SHM files
      expect(MockFs.exists(`${DATABASE_PATH}-wal`)).toBe(false);
      expect(MockFs.exists(`${DATABASE_PATH}-shm`)).toBe(false);
    });
  });

  describe('query helpers', () => {
    beforeEach(async () => {
      // Open a fresh database for each test
      await openDatabase();
    });

    it('run executes a statement with parameters', () => {
      // Insert a row using parameters
      insertItem('item-1', 'Item 1');

      // The row should be queryable
      expect(Sql.get<ItemRow>(WORKSPACE_ID, 'SELECT * FROM items')).toEqual({
        id: 'item-1',
        label: 'Item 1',
      });
    });

    it('get returns the first matching row', () => {
      // Insert two rows
      insertItem('item-1', 'Item 1');
      insertItem('item-2', 'Item 2');

      // Should return only the first match
      expect(
        Sql.get<ItemRow>(WORKSPACE_ID, 'SELECT * FROM items ORDER BY id'),
      ).toEqual({
        id: 'item-1',
        label: 'Item 1',
      });
    });

    it('get returns null when no rows match', () => {
      // Query an empty table
      expect(Sql.get(WORKSPACE_ID, 'SELECT * FROM items')).toBeNull();
    });

    it('all returns every matching row', () => {
      // Insert two rows
      insertItem('item-1', 'Item 1');
      insertItem('item-2', 'Item 2');

      // Should return both rows
      expect(
        Sql.all<ItemRow>(WORKSPACE_ID, 'SELECT * FROM items ORDER BY id'),
      ).toEqual([
        { id: 'item-1', label: 'Item 1' },
        { id: 'item-2', label: 'Item 2' },
      ]);
    });

    it('exec executes raw SQL', () => {
      // Create a table using raw SQL
      Sql.exec(WORKSPACE_ID, 'CREATE TABLE extra (id TEXT PRIMARY KEY)');

      // The table should be usable
      Sql.run(WORKSPACE_ID, 'INSERT INTO extra (id) VALUES (?)', 'extra-1');
      expect(Sql.all(WORKSPACE_ID, 'SELECT * FROM extra')).toHaveLength(1);
    });

    it('transaction applies all operations', () => {
      // Run two inserts in a transaction
      Sql.transaction(WORKSPACE_ID, [
        {
          sql: 'INSERT INTO items (id, label) VALUES (?, ?)',
          params: ['item-1', 'Item 1'],
        },
        {
          sql: 'INSERT INTO items (id, label) VALUES (?, ?)',
          params: ['item-2', 'Item 2'],
        },
      ]);

      // Both rows should be present
      expect(Sql.all(WORKSPACE_ID, 'SELECT * FROM items')).toHaveLength(2);
    });

    it('transaction rolls back all operations on error', () => {
      // Insert a row that will conflict with the transaction
      insertItem('item-2', 'Item 2');

      // Run a transaction whose second operation fails
      expect(() =>
        Sql.transaction(WORKSPACE_ID, [
          {
            sql: 'INSERT INTO items (id, label) VALUES (?, ?)',
            params: ['item-1', 'Item 1'],
          },
          {
            sql: 'INSERT INTO items (id, label) VALUES (?, ?)',
            params: ['item-2', 'Duplicate'],
          },
        ]),
      ).toThrow();

      // The first operation should have been rolled back
      expect(Sql.all(WORKSPACE_ID, 'SELECT * FROM items')).toHaveLength(1);
    });

    it('throws when the workspace has no open database', () => {
      // Close the workspace's connection
      Sql.close(WORKSPACE_ID);

      // Queries should throw without a connection
      expect(() => Sql.get(WORKSPACE_ID, 'SELECT * FROM items')).toThrow();
    });
  });

  describe('connect', () => {
    it('opens a connection via the registered adapter', () => {
      // Connect the workspace
      Sql.connect(WORKSPACE_ID);

      // The connection should be usable
      Sql.exec(WORKSPACE_ID, 'CREATE TABLE extra (id TEXT PRIMARY KEY)');
      Sql.run(WORKSPACE_ID, 'INSERT INTO extra (id) VALUES (?)', 'extra-1');
      expect(Sql.all(WORKSPACE_ID, 'SELECT * FROM extra')).toHaveLength(1);
    });
  });

  describe('close', () => {
    it('closes the workspace connection', async () => {
      // Open a database and close it
      await openDatabase();
      Sql.close(WORKSPACE_ID);

      // Queries should throw once closed
      expect(() => Sql.all(WORKSPACE_ID, 'SELECT * FROM items')).toThrow();
    });

    it('does nothing when the workspace has no connection', () => {
      // Close without an open connection
      expect(() => Sql.close(WORKSPACE_ID)).not.toThrow();
    });

    it('leaves other workspace connections open', async () => {
      // Open databases for two workspaces
      await openDatabase();
      await Sql.open('workspace-2', 'AppData/other.sql', {
        schema: SCHEMA,
        version: 1,
      });

      // Close one of them
      Sql.close(WORKSPACE_ID);

      // The other should still be usable
      expect(Sql.all('workspace-2', 'SELECT * FROM items')).toHaveLength(0);
    });
  });

  describe('closeAll', () => {
    it('closes every open connection', async () => {
      // Open databases for two workspaces
      await openDatabase();
      await Sql.open('workspace-2', 'AppData/other.sql', {
        schema: SCHEMA,
        version: 1,
      });

      Sql.closeAll();

      // Queries should throw for both once closed
      expect(() => Sql.all(WORKSPACE_ID, 'SELECT * FROM items')).toThrow();
      expect(() => Sql.all('workspace-2', 'SELECT * FROM items')).toThrow();
    });
  });
});

/**
 * Opens the test database at the given schema version.
 *
 * @param version - The schema version to open with.
 * @returns Whether the schema changed.
 */
function openDatabase(version = 1): Promise<{ schemaChanged: boolean }> {
  return Sql.open(WORKSPACE_ID, DATABASE_PATH, { schema: SCHEMA, version });
}

/**
 * Inserts an item row into the test database.
 *
 * @param id - The item ID.
 * @param label - The item label.
 */
function insertItem(id: string, label: string): void {
  Sql.run(
    WORKSPACE_ID,
    'INSERT INTO items (id, label) VALUES (?, ?)',
    id,
    label,
  );
}
