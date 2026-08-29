import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { createTestSqlAdapter } from '../test-utils';
import * as Sql from './Sql';

// Mock file system backing database file tracking in tests
const MockFs = initializeMockFileSystem();

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
    // Close the connection opened during the test
    Sql.close();
  });

  describe('open', () => {
    it('creates a fresh database from the schema', async () => {
      // Open a database at a path with no existing database
      const result = await openDatabase();

      // Should report the schema as changed
      expect(result.schemaChanged).toBe(true);

      // Should have created the schema tables
      insertItem('item-1', 'Item 1');
      expect(Sql.all('SELECT * FROM items')).toHaveLength(1);
    });

    it('stores the schema version and data version counter', async () => {
      // Open a fresh database
      await openDatabase(3);

      // Should store the provided schema version
      expect(
        Sql.get("SELECT value FROM meta WHERE key = 'schema_version'"),
      ).toEqual({ value: '3' });

      // Should initialize the data version counter
      expect(Sql.get("SELECT value FROM meta WHERE key = 'version'")).toEqual({
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
      expect(Sql.get<ItemRow>('SELECT * FROM items')).toEqual({
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
      expect(Sql.all('SELECT * FROM items')).toHaveLength(0);

      // Should store the new schema version
      expect(
        Sql.get("SELECT value FROM meta WHERE key = 'schema_version'"),
      ).toEqual({ value: '2' });
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
      expect(Sql.get<ItemRow>('SELECT * FROM items')).toEqual({
        id: 'item-1',
        label: 'Item 1',
      });
    });

    it('get returns the first matching row', () => {
      // Insert two rows
      insertItem('item-1', 'Item 1');
      insertItem('item-2', 'Item 2');

      // Should return only the first match
      expect(Sql.get<ItemRow>('SELECT * FROM items ORDER BY id')).toEqual({
        id: 'item-1',
        label: 'Item 1',
      });
    });

    it('get returns null when no rows match', () => {
      // Query an empty table
      expect(Sql.get('SELECT * FROM items')).toBeNull();
    });

    it('all returns every matching row', () => {
      // Insert two rows
      insertItem('item-1', 'Item 1');
      insertItem('item-2', 'Item 2');

      // Should return both rows
      expect(Sql.all<ItemRow>('SELECT * FROM items ORDER BY id')).toEqual([
        { id: 'item-1', label: 'Item 1' },
        { id: 'item-2', label: 'Item 2' },
      ]);
    });

    it('exec executes raw SQL', () => {
      // Create a table using raw SQL
      Sql.exec('CREATE TABLE extra (id TEXT PRIMARY KEY)');

      // The table should be usable
      Sql.run('INSERT INTO extra (id) VALUES (?)', 'extra-1');
      expect(Sql.all('SELECT * FROM extra')).toHaveLength(1);
    });

    it('transaction applies all operations', () => {
      // Run two inserts in a transaction
      Sql.transaction([
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
      expect(Sql.all('SELECT * FROM items')).toHaveLength(2);
    });

    it('transaction rolls back all operations on error', () => {
      // Insert a row that will conflict with the transaction
      insertItem('item-2', 'Item 2');

      // Run a transaction whose second operation fails
      expect(() =>
        Sql.transaction([
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
      expect(Sql.all('SELECT * FROM items')).toHaveLength(1);
    });

    it('throws when no database has been opened', () => {
      // Close the active connection
      Sql.close();

      // Queries should throw without a connection
      expect(() => Sql.get('SELECT * FROM items')).toThrow();
    });
  });

  describe('initialize', () => {
    it('opens a connection via the registered adapter', () => {
      // Initialize the connection
      Sql.initialize();

      // The connection should be usable
      Sql.exec('CREATE TABLE extra (id TEXT PRIMARY KEY)');
      Sql.run('INSERT INTO extra (id) VALUES (?)', 'extra-1');
      expect(Sql.all('SELECT * FROM extra')).toHaveLength(1);
    });
  });

  describe('close', () => {
    it('closes the active connection', async () => {
      // Open a database and close it
      await openDatabase();
      Sql.close();

      // Queries should throw once closed
      expect(() => Sql.all('SELECT * FROM items')).toThrow();
    });

    it('does nothing when no connection is open', () => {
      // Close without an open connection
      expect(() => Sql.close()).not.toThrow();
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
  return Sql.open(DATABASE_PATH, { schema: SCHEMA, version });
}

/**
 * Inserts an item row into the test database.
 *
 * @param id - The item ID.
 * @param label - The item label.
 */
function insertItem(id: string, label: string): void {
  Sql.run('INSERT INTO items (id, label) VALUES (?, ?)', id, label);
}
