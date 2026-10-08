// Increment this when the schema or indexing logic changes.
// On startup, if the stored schema version does not match,
// the SQL database is dropped and rebuilt from scratch.
export const SCHEMA_VERSION = 15;

// SQL schema for creating tables
export const SCHEMA_SQL = `
  -- Paths are workspace relative, so moving the workspace does not
  -- invalidate the index.
  CREATE TABLE IF NOT EXISTS databases (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    path            TEXT NOT NULL,
    icon            TEXT NOT NULL DEFAULT '',
    -- Hash of the database's property schema. Used to detect a schema
    -- changed while the app was closed.
    properties_hash TEXT NOT NULL DEFAULT ''
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

  -- Full-text index of text and content property values. A standalone
  -- table, not an external-content one. External content needs a rowid
  -- that survives VACUUM, and entry_properties has a composite primary
  -- key.
  CREATE VIRTUAL TABLE IF NOT EXISTS entry_content USING fts5(
    entry_id UNINDEXED,
    property_name UNINDEXED,
    property_type UNINDEXED,
    value,
    tokenize = 'unicode61 remove_diacritics 2'
  );

  -- The entry_content rowid of each indexed value. FTS5 cannot look
  -- rows up by an UNINDEXED column without scanning the whole table.
  CREATE TABLE IF NOT EXISTS entry_content_rows (
    id             INTEGER PRIMARY KEY,
    entry_id       TEXT NOT NULL,
    property_name  TEXT NOT NULL,
    UNIQUE (entry_id, property_name)
  );

  CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`;

// Triggers that keep entry_content in sync with the text and content
// values in entry_properties. Separate from SCHEMA_SQL, so the schema
// can be created without them. Every statement is idempotent.
export const ENTRY_CONTENT_TRIGGERS_SQL = `
  -- Index new text and content values
  CREATE TRIGGER IF NOT EXISTS entry_content_insert
  AFTER INSERT ON entry_properties
  WHEN new.property_type IN ('text', 'content') AND new.value_text IS NOT NULL
  BEGIN
    -- Add the value's index row
    INSERT INTO entry_content_rows (entry_id, property_name)
    VALUES (new.entry_id, new.property_name);

    -- Index the value under its row's ID
    INSERT INTO entry_content (rowid, entry_id, property_name, property_type, value)
    SELECT id, new.entry_id, new.property_name, new.property_type, new.value_text
    FROM entry_content_rows
    WHERE entry_id = new.entry_id AND property_name = new.property_name;
  END;

  -- Replace the indexed value when a text or content value changes
  CREATE TRIGGER IF NOT EXISTS entry_content_update
  AFTER UPDATE ON entry_properties
  WHEN old.property_type IN ('text', 'content')
    OR new.property_type IN ('text', 'content')
  BEGIN
    -- Remove the old value from the index
    DELETE FROM entry_content
    WHERE rowid IN (
      SELECT id FROM entry_content_rows
      WHERE entry_id = old.entry_id AND property_name = old.property_name
    );

    -- Remove the old value's index row
    DELETE FROM entry_content_rows
    WHERE entry_id = old.entry_id AND property_name = old.property_name;

    -- Add an index row for the new value if it is text or content
    INSERT INTO entry_content_rows (entry_id, property_name)
    SELECT new.entry_id, new.property_name
    WHERE new.property_type IN ('text', 'content')
      AND new.value_text IS NOT NULL;

    -- Index the new value under that row's ID
    INSERT INTO entry_content (rowid, entry_id, property_name, property_type, value)
    SELECT id, new.entry_id, new.property_name, new.property_type, new.value_text
    FROM entry_content_rows
    WHERE entry_id = new.entry_id
      AND property_name = new.property_name
      AND new.property_type IN ('text', 'content')
      AND new.value_text IS NOT NULL;
  END;

  -- Remove the indexed value when a text or content value is deleted
  CREATE TRIGGER IF NOT EXISTS entry_content_delete
  AFTER DELETE ON entry_properties
  WHEN old.property_type IN ('text', 'content')
  BEGIN
    -- Remove the old value from the index
    DELETE FROM entry_content
    WHERE rowid IN (
      SELECT id FROM entry_content_rows
      WHERE entry_id = old.entry_id AND property_name = old.property_name
    );

    -- Remove the old value's index row
    DELETE FROM entry_content_rows
    WHERE entry_id = old.entry_id AND property_name = old.property_name;
  END;
`;
