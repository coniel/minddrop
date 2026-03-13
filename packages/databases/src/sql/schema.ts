// Increment this when the schema or indexing logic changes.
// On startup, if the stored schema version does not match,
// the SQL database is dropped and rebuilt from scratch.
export const SCHEMA_VERSION = 4;

// SQL schema for creating tables
export const SCHEMA_SQL = `
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
    last_modified INTEGER NOT NULL,
    metadata      TEXT NOT NULL DEFAULT '{}'
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
    property_type  TEXT NOT NULL,
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
