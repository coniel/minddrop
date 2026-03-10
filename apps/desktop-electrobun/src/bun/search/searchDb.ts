import { Database } from 'bun:sqlite';
import { Utils } from 'electrobun/bun';
import fsp from 'node:fs/promises';
import type { SearchEntryData, SearchEntryProperty } from '@minddrop/search';
import { FUZZY_SEARCH_EXCLUDED_PROPERTY_TYPES } from '@minddrop/search';

// Increment this when the schema or indexing logic changes.
// On startup, if the stored schema version does not match,
// the SQLite database is dropped and rebuilt from scratch.
export const SEARCH_SCHEMA_VERSION = 2;

// Per-workspace SQLite database instances
const databases = new Map<string, Database>();

// SQL schema for creating tables
const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS databases (
    id   TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS entries (
    id            TEXT PRIMARY KEY,
    database_id   TEXT NOT NULL,
    path          TEXT NOT NULL UNIQUE,
    title         TEXT NOT NULL,
    created       INTEGER NOT NULL,
    last_modified INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_entries_database ON entries(database_id);
  CREATE INDEX IF NOT EXISTS idx_entries_title ON entries(title);

  CREATE TABLE IF NOT EXISTS entry_properties (
    entry_id       TEXT NOT NULL,
    property_name  TEXT NOT NULL,
    property_type  TEXT NOT NULL,
    value_text     TEXT,
    value_number   REAL,
    value_integer  INTEGER,
    PRIMARY KEY (entry_id, property_name),
    FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_props_name_text ON entry_properties(property_name, value_text);
  CREATE INDEX IF NOT EXISTS idx_props_name_number ON entry_properties(property_name, value_number);
  CREATE INDEX IF NOT EXISTS idx_props_name_integer ON entry_properties(property_name, value_integer);

  CREATE TABLE IF NOT EXISTS entry_property_values (
    entry_id       TEXT NOT NULL,
    property_name  TEXT NOT NULL,
    value_text     TEXT NOT NULL,
    FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_prop_values ON entry_property_values(entry_id, property_name);

  CREATE TABLE IF NOT EXISTS tags (
    id   TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS entry_tags (
    entry_id TEXT NOT NULL,
    tag_id   TEXT NOT NULL,
    PRIMARY KEY (entry_id, tag_id),
    FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`;

// Property types that map to value_text
const TEXT_PROPERTY_TYPES = new Set([
  'text',
  'formatted-text',
  'select',
  'url',
  'icon',
  'file',
  'image',
  'title',
]);

// Property types that map to value_integer (epoch ms or 0/1)
const INTEGER_PROPERTY_TYPES = new Set([
  'toggle',
  'date',
  'created',
  'last-modified',
]);

/**
 * Returns the directory path for a workspace's search database.
 */
function getSearchDbDir(workspaceId: string): string {
  return `${Utils.paths.config}/MindDrop/search/${workspaceId}`;
}

/**
 * Returns the file path for a workspace's search SQLite database.
 */
function getSearchDbPath(workspaceId: string): string {
  return `${getSearchDbDir(workspaceId)}/search.db`;
}

/**
 * Opens or creates a SQLite database for the given workspace.
 * Creates the directory and schema if they do not exist.
 */
export async function openSearchDb(
  workspaceId: string,
): Promise<{ database: Database; schemaChanged: boolean }> {
  // Return existing connection if already open
  const existing = databases.get(workspaceId);

  if (existing) {
    return { database: existing, schemaChanged: false };
  }

  // Ensure the directory exists
  const dir = getSearchDbDir(workspaceId);
  await fsp.mkdir(dir, { recursive: true });

  const dbPath = getSearchDbPath(workspaceId);
  let schemaChanged = false;

  // Check if existing database has a matching schema version
  try {
    const database = new Database(dbPath);
    database.exec('PRAGMA foreign_keys = ON');

    const row = database
      .prepare("SELECT value FROM meta WHERE key = 'schema_version'")
      .get() as { value: string } | null;

    const storedVersion = row ? parseInt(row.value, 10) : 0;

    if (storedVersion !== SEARCH_SCHEMA_VERSION) {
      console.log(
        `[search] Schema version mismatch (stored: ${storedVersion}, current: ${SEARCH_SCHEMA_VERSION}), rebuilding`,
      );

      // Close and delete the old database
      database.close();
      await fsp.rm(dbPath, { force: true });

      // Delete the WAL and SHM files if they exist
      await fsp.rm(`${dbPath}-wal`, { force: true });
      await fsp.rm(`${dbPath}-shm`, { force: true });

      schemaChanged = true;
    } else {
      // Schema matches, reuse the database
      database.exec('PRAGMA journal_mode = WAL');
      databases.set(workspaceId, database);

      return { database, schemaChanged: false };
    }
  } catch {
    // Database does not exist yet or is corrupt
    schemaChanged = true;
  }

  // Create a fresh database
  const database = new Database(dbPath);

  // Enable WAL mode for better concurrent read/write performance
  database.exec('PRAGMA journal_mode = WAL');
  // Enable foreign keys
  database.exec('PRAGMA foreign_keys = ON');

  // Create tables
  database.exec(SCHEMA_SQL);

  // Store the schema version
  database
    .prepare(
      "INSERT OR REPLACE INTO meta (key, value) VALUES ('schema_version', ?)",
    )
    .run(String(SEARCH_SCHEMA_VERSION));

  // Initialize the data version counter
  database
    .prepare("INSERT OR IGNORE INTO meta (key, value) VALUES ('version', '0')")
    .run();

  databases.set(workspaceId, database);

  return { database, schemaChanged };
}

/**
 * Returns an already-opened search database for the workspace.
 * Throws if the database has not been opened yet.
 */
export function getSearchDb(workspaceId: string): Database {
  const database = databases.get(workspaceId);

  if (!database) {
    throw new Error(
      `Search database not initialized for workspace ${workspaceId}`,
    );
  }

  return database;
}

/**
 * Upserts a database record into the databases table.
 */
export function upsertDatabase(
  workspaceId: string,
  databaseData: { id: string; name: string; path: string; icon: string },
): void {
  const database = getSearchDb(workspaceId);

  database
    .prepare(
      'INSERT OR REPLACE INTO databases (id, name, path, icon) VALUES (?, ?, ?, ?)',
    )
    .run(
      databaseData.id,
      databaseData.name,
      databaseData.path,
      databaseData.icon,
    );
}

/**
 * Renames a property across all entries in a database.
 * Updates both the entry_properties and entry_property_values
 * tables in a single transaction.
 */
export function renameProperty(
  workspaceId: string,
  databaseId: string,
  oldName: string,
  newName: string,
): void {
  const database = getSearchDb(workspaceId);

  const transaction = database.transaction(() => {
    // Rename in the scalar properties table
    database
      .prepare(
        `UPDATE entry_properties SET property_name = ?
         WHERE property_name = ?
         AND entry_id IN (SELECT id FROM entries WHERE database_id = ?)`,
      )
      .run(newName, oldName, databaseId);

    // Rename in the multi-value properties table
    database
      .prepare(
        `UPDATE entry_property_values SET property_name = ?
         WHERE property_name = ?
         AND entry_id IN (SELECT id FROM entries WHERE database_id = ?)`,
      )
      .run(newName, oldName, databaseId);

    // Increment the version counter
    database
      .prepare(
        "UPDATE meta SET value = CAST(CAST(value AS INTEGER) + 1 AS TEXT) WHERE key = 'version'",
      )
      .run();
  });

  transaction();
}

/**
 * Deletes a database record from the databases table.
 */
export function deleteDatabase(workspaceId: string, databaseId: string): void {
  const database = getSearchDb(workspaceId);

  database.prepare('DELETE FROM databases WHERE id = ?').run(databaseId);
}

/**
 * Retrieves a database name by its ID.
 */
export function getDatabaseName(
  workspaceId: string,
  databaseId: string,
): string | null {
  const database = getSearchDb(workspaceId);
  const row = database
    .prepare('SELECT name FROM databases WHERE id = ?')
    .get(databaseId) as { name: string } | null;

  return row?.name ?? null;
}

/**
 * Retrieves a database's icon by its ID.
 */
export function getDatabaseIcon(
  workspaceId: string,
  databaseId: string,
): string {
  const database = getSearchDb(workspaceId);
  const row = database
    .prepare('SELECT icon FROM databases WHERE id = ?')
    .get(databaseId) as { icon: string } | null;

  return row?.icon ?? '';
}

/**
 * Upserts one or more entries into the search database.
 * Uses a transaction for bulk operations.
 */
export function upsertEntries(
  workspaceId: string,
  entries: SearchEntryData[],
): void {
  const database = getSearchDb(workspaceId);

  const upsertEntry = database.prepare(
    `INSERT OR REPLACE INTO entries (id, database_id, path, title, created, last_modified)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );

  const deleteProps = database.prepare(
    'DELETE FROM entry_properties WHERE entry_id = ?',
  );

  const deletePropValues = database.prepare(
    'DELETE FROM entry_property_values WHERE entry_id = ?',
  );

  const insertProp = database.prepare(
    `INSERT INTO entry_properties (entry_id, property_name, property_type, value_text, value_number, value_integer)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );

  const insertPropValue = database.prepare(
    `INSERT INTO entry_property_values (entry_id, property_name, value_text)
     VALUES (?, ?, ?)`,
  );

  const incrementVersion = database.prepare(
    "UPDATE meta SET value = CAST(CAST(value AS INTEGER) + 1 AS TEXT) WHERE key = 'version'",
  );

  // Run everything in a transaction
  const transaction = database.transaction(() => {
    for (const entry of entries) {
      // Upsert the entry row
      upsertEntry.run(
        entry.id,
        entry.databaseId,
        entry.path,
        entry.title,
        entry.created,
        entry.lastModified,
      );

      // Clear existing properties for this entry
      deleteProps.run(entry.id);
      deletePropValues.run(entry.id);

      // Insert new properties
      for (const property of entry.properties) {
        insertProperty(insertProp, insertPropValue, entry.id, property);
      }
    }

    // Increment the version counter
    incrementVersion.run();
  });

  transaction();
}

/**
 * Deletes one or more entries from the search database.
 * CASCADE takes care of cleaning up related property rows.
 */
export function deleteEntries(workspaceId: string, entryIds: string[]): void {
  const database = getSearchDb(workspaceId);

  const deleteEntry = database.prepare('DELETE FROM entries WHERE id = ?');

  const incrementVersion = database.prepare(
    "UPDATE meta SET value = CAST(CAST(value AS INTEGER) + 1 AS TEXT) WHERE key = 'version'",
  );

  const transaction = database.transaction(() => {
    for (const id of entryIds) {
      deleteEntry.run(id);
    }

    incrementVersion.run();
  });

  transaction();
}

/**
 * Returns the current version counter for the workspace.
 */
export function getVersion(workspaceId: string): number {
  const database = getSearchDb(workspaceId);
  const row = database
    .prepare("SELECT value FROM meta WHERE key = 'version'")
    .get() as { value: string } | null;

  return row ? parseInt(row.value, 10) : 0;
}

/**
 * Retrieves all entries for a given workspace as SearchEntryData
 * objects, used for building the MiniSearch index.
 */
export function getAllEntries(
  workspaceId: string,
): { id: string; databaseId: string; title: string }[] {
  const database = getSearchDb(workspaceId);

  return database
    .prepare('SELECT id, database_id as databaseId, title FROM entries')
    .all() as { id: string; databaseId: string; title: string }[];
}

/**
 * Retrieves all text content for a given entry, used for building
 * the MiniSearch full-text index.
 */
export function getEntryTextContent(
  workspaceId: string,
  entryId: string,
): { textValues: string[]; propertyValues: string[] } {
  const database = getSearchDb(workspaceId);

  // Build a SQL exclusion list from the constant
  const excludedTypes = [...FUZZY_SEARCH_EXCLUDED_PROPERTY_TYPES]
    .map((type) => `'${type}'`)
    .join(', ');

  // Get text properties (for the "content" field)
  const textRows = database
    .prepare(
      "SELECT value_text FROM entry_properties WHERE entry_id = ? AND property_type IN ('text', 'formatted-text')",
    )
    .all(entryId) as { value_text: string | null }[];

  // Get other scalar property values (for the "properties" field).
  // Excluded property types are not part of the full-text index.
  const propertyRows = database
    .prepare(
      `SELECT value_text FROM entry_properties WHERE entry_id = ? AND property_type NOT IN ('text', 'formatted-text', ${excludedTypes})`,
    )
    .all(entryId) as { value_text: string | null }[];

  const textValues = textRows
    .map((row) => row.value_text)
    .filter((value): value is string => value !== null);

  const propertyValues = propertyRows
    .map((row) => row.value_text)
    .filter((value): value is string => value !== null);

  return { textValues, propertyValues };
}

/**
 * Retrieves all databases for a given workspace.
 */
export function getAllDatabases(
  workspaceId: string,
): { id: string; name: string; path: string; icon: string }[] {
  const database = getSearchDb(workspaceId);

  return database
    .prepare('SELECT id, name, path, icon FROM databases')
    .all() as {
    id: string;
    name: string;
    path: string;
    icon: string;
  }[];
}

/**
 * Returns a map of entry ID to last_modified timestamp for all
 * entries in the given database. Used to diff against fresh file
 * reads and skip unchanged entries on startup.
 */
export function getEntryTimestamps(
  workspaceId: string,
  databaseId: string,
): Map<string, number> {
  const database = getSearchDb(workspaceId);

  const rows = database
    .prepare('SELECT id, last_modified FROM entries WHERE database_id = ?')
    .all(databaseId) as { id: string; last_modified: number }[];

  return new Map(rows.map((row) => [row.id, row.last_modified]));
}

/**
 * Retrieves all text-searchable property name-value pairs for
 * an entry. Used for finding which properties matched a search
 * query. Includes text properties, collection values, and
 * select/url/etc. properties.
 */
export function getEntryPropertyValues(
  workspaceId: string,
  entryId: string,
): { name: string; value: string; type: string }[] {
  const database = getSearchDb(workspaceId);

  // Build a SQL exclusion list from the constant
  const excludedTypes = [...FUZZY_SEARCH_EXCLUDED_PROPERTY_TYPES]
    .map((type) => `'${type}'`)
    .join(', ');

  // Get scalar properties (excluded types are not part of
  // the full-text index)
  const rows = database
    .prepare(
      `SELECT property_name, property_type, value_text FROM entry_properties WHERE entry_id = ? AND value_text IS NOT NULL AND property_type NOT IN (${excludedTypes})`,
    )
    .all(entryId) as {
    property_name: string;
    property_type: string;
    value_text: string;
  }[];

  return rows.map((row) => ({
    name: row.property_name,
    value: row.value_text,
    type: row.property_type,
  }));
}

/**
 * Closes the search database for a workspace and removes it
 * from the connection pool.
 */
export function closeSearchDb(workspaceId: string): void {
  const database = databases.get(workspaceId);

  if (database) {
    database.close();
    databases.delete(workspaceId);
  }
}

/**
 * Closes all open search databases.
 */
export function closeAllSearchDbs(): void {
  for (const [id, database] of databases) {
    database.close();
    databases.delete(id);
  }
}

/**
 * Inserts a single property value into the appropriate table(s)
 * based on the property type.
 */
function insertProperty(
  insertProp: ReturnType<Database['prepare']>,
  insertPropValue: ReturnType<Database['prepare']>,
  entryId: string,
  property: SearchEntryProperty,
): void {
  // Skip null values
  if (property.value === null) {
    return;
  }

  // Collection properties go into the multi-value table
  if (property.type === 'collection' && Array.isArray(property.value)) {
    for (const value of property.value) {
      insertPropValue.run(entryId, property.name, value);
    }

    return;
  }

  // Determine which value column to use
  let valueText: string | null = null;
  let valueNumber: number | null = null;
  let valueInteger: number | null = null;

  if (TEXT_PROPERTY_TYPES.has(property.type)) {
    valueText = String(property.value);
  } else if (property.type === 'number') {
    valueNumber = Number(property.value);
  } else if (INTEGER_PROPERTY_TYPES.has(property.type)) {
    // Toggle: boolean -> 0/1, dates: epoch ms
    if (typeof property.value === 'boolean') {
      valueInteger = property.value ? 1 : 0;
    } else {
      valueInteger = Number(property.value);
    }
  }

  insertProp.run(
    entryId,
    property.name,
    property.type,
    valueText,
    valueNumber,
    valueInteger,
  );
}
