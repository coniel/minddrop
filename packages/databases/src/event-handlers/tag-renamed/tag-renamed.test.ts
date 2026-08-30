import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TagFixtures } from '@minddrop/tags/test-utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasesStore } from '../../DatabasesStore';
import { sqlGetEntryPropertyValues, sqlUpsertDatabase } from '../../sql';
import {
  MockFs,
  cleanup,
  cleanupRecordingTestSqlDatabase,
  clearRecordedSqlStatements,
  getRecordedSqlStatements,
  objectDatabase,
  objectEntry1,
  parentDir,
  setup,
  setupRecordingTestSqlDatabase,
} from '../../test-utils';
import { onTagRenamed } from './tag-renamed';

const { tag_1 } = TagFixtures;

// A database with a tags property
const tagsDatabase = {
  ...objectDatabase,
  id: 'database_tags-test' as const,
  name: 'Tagged Objects',
  path: `${parentDir}/Tagged Objects`,
  properties: [
    ...objectDatabase.properties,
    { type: 'tags' as const, name: 'Tags' },
  ],
};

// An entry referencing the renamed tag
const taggedEntry = {
  ...objectEntry1,
  id: 'database-entry_tagged-entry' as const,
  title: 'Tagged Entry',
  database: tagsDatabase.id,
  path: `${tagsDatabase.path}/Tagged Entry.md`,
  properties: {
    ...objectEntry1.properties,
    Tags: ['Urgent', 'Home'],
  },
};

// The renamed tag's original and updated versions
const originalTag = { ...tag_1, name: 'Urgent' };
const renamedTag = { ...tag_1, name: 'Later' };

describe('onTagRenamed', () => {
  beforeEach(() => {
    setup();

    // Open a recording in-memory SQL database
    setupRecordingTestSqlDatabase();

    // Add the tags database and its entry to the stores
    DatabasesStore.set(tagsDatabase);
    DatabaseEntriesStore.set(taggedEntry);

    // Add the database's SQL record so entry upserts satisfy the
    // foreign key, dropping the statement from the recording
    sqlUpsertDatabase(tagsDatabase, { silent: true });
    clearRecordedSqlStatements();

    // Create the tags database directory so entry rewrites can
    // write the entry file
    MockFs.addFiles([tagsDatabase.path]);
  });

  afterEach(() => {
    cleanupRecordingTestSqlDatabase();
    cleanup();
  });

  it('rewrites the tag name in referencing entries', async () => {
    await onTagRenamed({ original: originalTag, updated: renamedTag });

    // The entry's value should carry the new name in place of the
    // old one
    const entry = DatabaseEntriesStore.get(taggedEntry.id);
    expect(entry?.properties.Tags).toEqual(['Later', 'Home']);
  });

  it('dedupes when the new name is already present', async () => {
    // Reference both the old and new names
    DatabaseEntriesStore.update(taggedEntry.id, {
      properties: { ...taggedEntry.properties, Tags: ['Urgent', 'Later'] },
    });

    await onTagRenamed({ original: originalTag, updated: renamedTag });

    // The mapped name should collapse into the existing one
    const entry = DatabaseEntriesStore.get(taggedEntry.id);
    expect(entry?.properties.Tags).toEqual(['Later']);
  });

  it('writes the rewritten entry to the file system', async () => {
    await onTagRenamed({ original: originalTag, updated: renamedTag });

    // The entry file should contain the new name and not the old
    const contents = MockFs.readTextFile(taggedEntry.path);
    expect(contents).toContain('Later');
    expect(contents).not.toContain('Urgent');
  });

  it('updates the SQL records with the rewritten values', async () => {
    await onTagRenamed({ original: originalTag, updated: renamedTag });

    // The entry's SQL property values should carry the new name
    const values = sqlGetEntryPropertyValues(taggedEntry.id).map(
      (property) => property.value,
    );
    expect(values).toContain('Later');
    expect(values).not.toContain('Urgent');
  });

  it('does nothing when no entry references the tag', async () => {
    // Rename a tag no entry references
    await onTagRenamed({
      original: { ...tag_1, name: 'Unused' },
      updated: { ...tag_1, name: 'Still Unused' },
    });

    // The entry should be unchanged
    const entry = DatabaseEntriesStore.get(taggedEntry.id);
    expect(entry?.properties.Tags).toEqual(['Urgent', 'Home']);

    // No SQL statements should have been executed
    expect(getRecordedSqlStatements()).toEqual([]);
  });

  it('ignores entries of databases without tags properties', async () => {
    await onTagRenamed({ original: originalTag, updated: renamedTag });

    // The tagless database's entry should be unchanged
    const entry = DatabaseEntriesStore.get(objectEntry1.id);
    expect(entry).toEqual(objectEntry1);
  });
});
