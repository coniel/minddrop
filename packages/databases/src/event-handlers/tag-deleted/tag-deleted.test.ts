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
import { onTagDeleted } from './tag-deleted';

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

// An entry referencing the deleted tag
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

// The deleted tag
const deletedTag = { ...tag_1, name: 'Urgent' };

describe('onTagDeleted', () => {
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

  afterEach(async () => {
    cleanupRecordingTestSqlDatabase();
    await cleanup();
  });

  it('removes the tag name from referencing entries', async () => {
    await onTagDeleted(deletedTag);

    // The entry's value should no longer contain the deleted name
    const entry = DatabaseEntriesStore.get(taggedEntry.id);
    expect(entry?.properties.Tags).toEqual(['Home']);
  });

  it('writes the rewritten entry to the file system', async () => {
    await onTagDeleted(deletedTag);

    // The entry file should no longer contain the deleted name
    const contents = MockFs.readTextFile(taggedEntry.path);
    expect(contents).toContain('Home');
    expect(contents).not.toContain('Urgent');
  });

  it('updates the SQL records with the rewritten values', async () => {
    await onTagDeleted(deletedTag);

    // The entry's SQL property values should not contain the
    // deleted name
    const values = sqlGetEntryPropertyValues(taggedEntry.id).map(
      (property) => property.value,
    );
    expect(values).toContain('Home');
    expect(values).not.toContain('Urgent');
  });

  it('does nothing when no entry references the tag', async () => {
    // Delete a tag no entry references
    await onTagDeleted({ ...tag_1, name: 'Unused' });

    // The entry should be unchanged
    const entry = DatabaseEntriesStore.get(taggedEntry.id);
    expect(entry?.properties.Tags).toEqual(['Urgent', 'Home']);

    // No SQL statements should have been executed
    expect(getRecordedSqlStatements()).toEqual([]);
  });

  it('ignores entries of databases without tags properties', async () => {
    await onTagDeleted(deletedTag);

    // The tagless database's entry should be unchanged
    const entry = DatabaseEntriesStore.get(objectEntry1.id);
    expect(entry).toEqual(objectEntry1);
  });
});
