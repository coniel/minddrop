import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Sql } from '@minddrop/sql';
import {
  WorkspaceFixtures,
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { EntryContentPendingMetaKey } from '../../constants';
import {
  DatabaseFixtures,
  MockFs,
  cleanupTestSqlDatabase,
  setupTestSqlDatabase,
} from '../../test-utils';
import { SqlEntryRecord } from '../../types';
import { ENTRY_CONTENT_TRIGGERS_SQL } from '../schema';
import { sqlSearchEntryContent } from '../sqlSearchEntryContent';
import { sqlUpsertDatabase } from '../sqlUpsertDatabase';
import { sqlUpsertEntries } from '../sqlUpsertEntries';
import { fillEntryContentIndex } from './fillEntryContentIndex';

const { workspace_1 } = WorkspaceFixtures;
const { objectDatabase, objectEntry1SqlRecord } = DatabaseFixtures;

const workspaceId = workspace_1.id;

// Highlight markers for searching the index
const markers = { highlightStart: '[', highlightEnd: ']' };

/**
 * Builds entry records with a content, a text and a URL value each.
 *
 * @param count - The number of entries to build.
 * @param word - The word the entries' content values contain.
 * @returns The entry records.
 */
function buildEntries(count: number, word: string): SqlEntryRecord[] {
  return Array.from({ length: count }, (_, index) => ({
    ...objectEntry1SqlRecord,
    id: `database-entry_${word}-${index}`,
    path: `${word}-${index}.md`,
    title: `${word} ${index}`,
    properties: [
      { name: 'Content', type: 'content', value: `${word} body ${index}` },
      { name: 'Notes', type: 'text', value: `notes ${index}` },
      { name: 'Source', type: 'url', value: `https://fig.com/${index}` },
    ],
  }));
}

/**
 * Inserts entries without the content triggers, as a full rebuild
 * does, and marks the content index as pending.
 *
 * @param entries - The entries to insert.
 */
function seedRebuiltEntries(entries: SqlEntryRecord[]): void {
  // Drop the triggers for the rebuild
  Sql.exec(
    workspaceId,
    `DROP TRIGGER entry_content_insert;
     DROP TRIGGER entry_content_update;
     DROP TRIGGER entry_content_delete;`,
  );

  // Insert the entries
  sqlUpsertEntries(objectDatabase.id, entries, { silent: true });

  // Mark the content index as pending and recreate the triggers
  Sql.run(
    workspaceId,
    "INSERT INTO meta (key, value) VALUES (?, '1')",
    EntryContentPendingMetaKey,
  );
  Sql.exec(workspaceId, ENTRY_CONTENT_TRIGGERS_SQL);
}

/**
 * Reads whether the content index is marked as pending.
 *
 * @returns Whether the pending marker is set.
 */
function isPending(): boolean {
  return !!Sql.get(
    workspaceId,
    'SELECT value FROM meta WHERE key = ?',
    EntryContentPendingMetaKey,
  );
}

describe('fillEntryContentIndex', () => {
  beforeEach(() => {
    // Load the workspace the SQL helpers target by default
    setupWorkspaceFixtures(MockFs, {
      loadWorkspaceFiles: false,
      loadWorkspacesConfig: false,
    });

    // Open an in-memory database and seed the entries' database
    setupTestSqlDatabase();
    Sql.exec(workspaceId, 'PRAGMA foreign_keys = ON');
    sqlUpsertDatabase(objectDatabase, { silent: true });
  });

  afterEach(() => {
    cleanupTestSqlDatabase();
    cleanupWorkspaceFixtures();
  });

  it('indexes the text and content values of a rebuilt index', async () => {
    seedRebuiltEntries(buildEntries(3, 'apple'));

    await fillEntryContentIndex(workspaceId);

    expect(sqlSearchEntryContent('apple', markers)).toHaveLength(3);
    expect(sqlSearchEntryContent('notes', markers)).toHaveLength(3);
  });

  it('leaves other property types out of the index', async () => {
    seedRebuiltEntries(buildEntries(1, 'apple'));

    await fillEntryContentIndex(workspaceId);

    expect(sqlSearchEntryContent('fig', markers)).toEqual([]);
  });

  it('marks the content index as filled', async () => {
    seedRebuiltEntries(buildEntries(1, 'apple'));

    await fillEntryContentIndex(workspaceId);

    expect(isPending()).toBe(false);
  });

  it('fills around values the triggers already indexed', async () => {
    seedRebuiltEntries(buildEntries(2, 'apple'));

    // Save one of the entries again. The triggers index it.
    sqlUpsertEntries(objectDatabase.id, buildEntries(1, 'apple'), {
      silent: true,
    });

    await expect(fillEntryContentIndex(workspaceId)).resolves.toBeUndefined();
    expect(sqlSearchEntryContent('apple', markers)).toHaveLength(2);
  });

  it('does nothing when the content index is not pending', async () => {
    // Insert entries without the triggers, then remove the pending
    // marker.
    seedRebuiltEntries(buildEntries(1, 'apple'));
    Sql.run(
      workspaceId,
      'DELETE FROM meta WHERE key = ?',
      EntryContentPendingMetaKey,
    );

    await fillEntryContentIndex(workspaceId);

    expect(sqlSearchEntryContent('apple', markers)).toEqual([]);
  });

  it('indexes values across several chunks', async () => {
    // Insert more property rows than fit in one chunk
    seedRebuiltEntries(buildEntries(2600, 'pear'));

    await fillEntryContentIndex(workspaceId);

    expect(
      sqlSearchEntryContent('pear', { ...markers, limit: 3000 }),
    ).toHaveLength(2600);
  });

  it('stays pending when the workspace closes during the fill', async () => {
    seedRebuiltEntries(buildEntries(2600, 'pear'));

    // Start the fill, which indexes its first chunk before yielding
    const fill = fillEntryContentIndex(workspaceId);

    // Close the workspace while the fill is yielding
    Sql.close(workspaceId);
    await fill;

    // Reconnect to the same database
    Sql.connect(workspaceId);

    // Count the indexed values
    const indexed = sqlSearchEntryContent('pear', {
      ...markers,
      limit: 3000,
    }).length;

    expect(indexed).toBeGreaterThan(0);
    expect(indexed).toBeLessThan(2600);
    expect(isPending()).toBe(true);
  });

  it('resumes an interrupted fill', async () => {
    seedRebuiltEntries(buildEntries(2600, 'pear'));

    // Start a first fill and close the workspace while it is yielding
    const fill = fillEntryContentIndex(workspaceId);

    Sql.close(workspaceId);
    await fill;

    // Reconnect and run the fill again
    Sql.connect(workspaceId);
    await fillEntryContentIndex(workspaceId);

    expect(
      sqlSearchEntryContent('pear', { ...markers, limit: 3000 }),
    ).toHaveLength(2600);
    expect(isPending()).toBe(false);
  });
});
