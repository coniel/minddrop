import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { History } from '@minddrop/history';
import { storeItem } from '@minddrop/stores/test-utils';
import { TagFixtures } from '@minddrop/tags/test-utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasesStore } from '../../DatabasesStore';
import { EntryHistorySubjectType } from '../../constants';
import { sqlGetEntryPropertyValues, sqlUpsertDatabase } from '../../sql';
import {
  MockFs,
  cleanup,
  cleanupRecordingTestSqlDatabase,
  clearRecordedSqlStatements,
  getRecordedSqlStatements,
  objectDatabase,
  objectEntry1,
  setup,
  setupRecordingTestSqlDatabase,
} from '../../test-utils';
import { resolveDatabaseEntryPath, resolveDatabasePath } from '../../utils';
import { onTagDeleted } from './tag-deleted';

const { tag_1, historyAction_tagDeleted } = TagFixtures;

// A database with a tags property
const tagsDatabase = {
  ...objectDatabase,
  id: 'database_tags-test' as const,
  name: 'Tagged Objects',
  path: 'Tagged Objects',
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
  path: 'Tagged Entry.md',
  properties: {
    ...objectEntry1.properties,
    Tags: ['Urgent', 'Home'],
  },
};

// The deleted tag, as the tag deleted event carries it
const deletedTag = {
  ...tag_1,
  name: 'Urgent',
  action: historyAction_tagDeleted,
};

describe('onTagDeleted', () => {
  beforeEach(() => {
    setup();

    // Open a recording in-memory SQL database
    setupRecordingTestSqlDatabase();

    // Add the tags database and its entry to the stores
    DatabasesStore.set(tagsDatabase);
    DatabaseEntriesStore.set(taggedEntry);

    // Add the database's SQL record so entry upserts satisfy the
    // foreign key. The statement is then dropped from the recording.
    sqlUpsertDatabase(tagsDatabase, { silent: true });
    clearRecordedSqlStatements();

    // Create the tags database directory so entry rewrites can
    // write the entry file.
    MockFs.addFiles([resolveDatabasePath(tagsDatabase)]);
  });

  afterEach(async () => {
    cleanupRecordingTestSqlDatabase();
    await cleanup();
  });

  it('removes the tag name from referencing entries', async () => {
    await onTagDeleted(deletedTag);

    // The entry's value should no longer contain the deleted name
    const entry = storeItem(DatabaseEntriesStore, taggedEntry.id);
    expect(entry.properties.Tags).toEqual(['Home']);
  });

  it('writes the rewritten entry to the file system', async () => {
    await onTagDeleted(deletedTag);

    // The entry file should no longer contain the deleted name
    const contents = MockFs.readTextFile(
      resolveDatabaseEntryPath(taggedEntry, tagsDatabase),
    );
    expect(contents).toContain('Home');
    expect(contents).not.toContain('Urgent');
  });

  it('updates the SQL records with the rewritten values', async () => {
    await onTagDeleted(deletedTag);

    // The entry's SQL property values should not contain the
    // deleted name.
    const values = sqlGetEntryPropertyValues(taggedEntry.id).map(
      (property) => property.value,
    );
    expect(values).toContain('Home');
    expect(values).not.toContain('Urgent');
  });

  it('does nothing when no entry references the tag', async () => {
    // Delete a tag no entry references
    await onTagDeleted({ ...deletedTag, name: 'Unused' });

    // The entry should be unchanged
    const entry = storeItem(DatabaseEntriesStore, taggedEntry.id);
    expect(entry.properties.Tags).toEqual(['Urgent', 'Home']);

    // No SQL statements should have been executed
    expect(getRecordedSqlStatements()).toEqual([]);
  });

  it('ignores entries of databases without tags properties', async () => {
    await onTagDeleted(deletedTag);

    // The tagless database's entry should be unchanged
    const entry = storeItem(DatabaseEntriesStore, objectEntry1.id);
    expect(entry).toEqual(objectEntry1);
  });

  it('records the dropped values against the entries with the tag', async () => {
    await onTagDeleted(deletedTag);

    expect(
      await History.read({
        ownerPath: resolveDatabasePath(tagsDatabase),
        subjectType: EntryHistorySubjectType,
        subjectKey: taggedEntry.title,
      }),
    ).toContainEqual(
      expect.objectContaining({
        kind: 'property',
        changes: [{ property: 'Tags', from: ['Urgent', 'Home'], to: ['Home'] }],
        action: historyAction_tagDeleted,
      }),
    );
  });

  it("stamps the deletion's action on every record", async () => {
    // A second entry in the same database with the tag
    const secondEntry = {
      ...taggedEntry,
      id: 'database-entry_second-tagged-entry' as const,
      title: 'Second Tagged Entry',
      path: 'Second Tagged Entry.md',
    };

    DatabaseEntriesStore.set(secondEntry);

    await onTagDeleted(deletedTag);

    const records = await Promise.all(
      [taggedEntry, secondEntry].map((entry) =>
        History.read({
          ownerPath: resolveDatabasePath(tagsDatabase),
          subjectType: EntryHistorySubjectType,
          subjectKey: entry.title,
        }),
      ),
    );
    const actions = records.flat().map((record) => record.action);

    // Both records should carry the event's action
    expect(actions).toEqual([
      historyAction_tagDeleted,
      historyAction_tagDeleted,
    ]);
  });

  it('records nothing against entries without the tag', async () => {
    // An entry in the same database without the deleted tag
    const untagged = {
      ...taggedEntry,
      id: 'database-entry_untagged-entry' as const,
      title: 'Untagged Entry',
      path: 'Untagged Entry.md',
      properties: { ...taggedEntry.properties, Tags: ['Home'] },
    };

    DatabaseEntriesStore.set(untagged);

    await onTagDeleted(deletedTag);

    expect(
      await History.read({
        ownerPath: resolveDatabasePath(tagsDatabase),
        subjectType: EntryHistorySubjectType,
        subjectKey: untagged.title,
      }),
    ).toEqual([]);
  });
});
