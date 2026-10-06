// Increment this when the schema or indexing logic changes.
// On startup, if the stored schema version does not match,
// the SQL database is dropped and rebuilt from scratch.
export const SCHEMA_VERSION = 13;

// SQL schema for creating tables
export const SCHEMA_SQL = `
  -- Paths are workspace relative, so moving the workspace does not
  -- invalidate the index.
  CREATE TABLE IF NOT EXISTS databases (
    id   TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS entries (
    id            TEXT PRIMARY KEY,
    database_id   TEXT NOT NULL,
    path          TEXT NOT NULL,
    title         TEXT NOT NULL,
    created       INTEGER NOT NULL,
    last_modified INTEGER NOT NULL,
    content_hash  TEXT NOT NULL DEFAULT '',
    metadata      TEXT NOT NULL DEFAULT '{}',
    -- Entry paths are relative to their database, so they are only
    -- unique within one.
    UNIQUE (database_id, path),
    FOREIGN KEY (database_id) REFERENCES databases(id) ON DELETE CASCADE
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

  -- The references each entry has to other entries. Property
  -- references store the referenced entry's ID. Wikilinks store the
  -- reference as written. They are matched against entries' titles
  -- and addresses when read, so creating, renaming or deleting an
  -- entry never leaves a row resolved to the wrong one.
  CREATE TABLE IF NOT EXISTS entry_references (
    entry_id         TEXT NOT NULL,
    kind             TEXT NOT NULL,
    property_name    TEXT,
    target_entry_id  TEXT,
    target_reference TEXT,
    -- The reference's key, for matching regardless of case
    target_key       TEXT,
    fragment         TEXT,
    FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_references_entry ON entry_references(entry_id);
  CREATE INDEX IF NOT EXISTS idx_references_target_entry ON entry_references(target_entry_id);
  CREATE INDEX IF NOT EXISTS idx_references_target_key ON entry_references(target_key);

  CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`;
