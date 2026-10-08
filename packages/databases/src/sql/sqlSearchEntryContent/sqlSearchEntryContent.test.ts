import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Sql } from '@minddrop/sql';
import {
  WorkspaceFixtures,
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import {
  DatabaseFixtures,
  MockFs,
  cleanupTestSqlDatabase,
  setupTestSqlDatabase,
} from '../../test-utils';
import { SqlEntryRecord } from '../../types';
import { sqlDeleteEntries } from '../sqlDeleteEntries';
import { sqlRenameProperty } from '../sqlRenameProperty';
import { sqlUpsertDatabase } from '../sqlUpsertDatabase';
import { sqlUpsertEntries } from '../sqlUpsertEntries';
import { sqlSearchEntryContent } from './sqlSearchEntryContent';

const { workspace_1 } = WorkspaceFixtures;
const { objectDatabase, objectEntry1SqlRecord, urlDatabase } = DatabaseFixtures;

// Highlight markers which read clearly in assertions
const markers = { highlightStart: '[', highlightEnd: ']' };

// Entry mentioning apples in its content
const appleEntry: SqlEntryRecord = {
  ...objectEntry1SqlRecord,
  id: 'database-entry_apple',
  path: 'Apple.md',
  title: 'Apple',
  properties: [
    { name: 'Content', type: 'content', value: 'An apple a day' },
    { name: 'Source', type: 'url', value: 'https://banana.com' },
  ],
};

// Entry mentioning bananas in a text property
const bananaEntry: SqlEntryRecord = {
  ...objectEntry1SqlRecord,
  id: 'database-entry_banana',
  path: 'Banana.md',
  title: 'Banana',
  properties: [
    { name: 'Notes', type: 'text', value: 'Bananas are yellow' },
    { name: 'Content', type: 'content', value: 'Peel before eating' },
  ],
};

// Entry in another database mentioning apples
const otherDatabaseEntry: SqlEntryRecord = {
  ...objectEntry1SqlRecord,
  id: 'database-entry_other',
  databaseId: urlDatabase.id,
  path: 'Other.md',
  title: 'Other',
  properties: [{ name: 'Content', type: 'content', value: 'Apple pie' }],
};

describe('sqlSearchEntryContent', () => {
  beforeEach(() => {
    // Load the workspace the SQL helpers target by default
    setupWorkspaceFixtures(MockFs, {
      loadWorkspaceFiles: false,
      loadWorkspacesConfig: false,
    });

    // Open an in-memory database, enforcing foreign keys so that
    // entry deletes cascade to their properties.
    setupTestSqlDatabase();
    Sql.exec(workspace_1.id, 'PRAGMA foreign_keys = ON');

    // Seed the databases and their entries
    sqlUpsertDatabase(objectDatabase, { silent: true });
    sqlUpsertDatabase(urlDatabase, { silent: true });
    sqlUpsertEntries(objectDatabase.id, [appleEntry, bananaEntry], {
      silent: true,
    });
    sqlUpsertEntries(urlDatabase.id, [otherDatabaseEntry], { silent: true });
  });

  afterEach(() => {
    cleanupTestSqlDatabase();
    cleanupWorkspaceFixtures();
  });

  it('returns the content values matching the query', () => {
    const matches = sqlSearchEntryContent('day', markers);

    expect(matches).toEqual([
      {
        entryId: appleEntry.id,
        entryTitle: appleEntry.title,
        databaseId: objectDatabase.id,
        databaseName: objectDatabase.name,
        databaseIcon: objectDatabase.icon,
        propertyName: 'Content',
        propertyType: 'content',
        snippet: 'An apple a [day]',
        rank: expect.any(Number),
      },
    ]);
  });

  it('matches text property values', () => {
    const matches = sqlSearchEntryContent('yellow', markers);

    expect(matches.map((match) => match.propertyName)).toEqual(['Notes']);
  });

  it('matches words by prefix', () => {
    const matches = sqlSearchEntryContent('bana', markers);

    expect(matches.map((match) => match.snippet)).toEqual([
      '[Bananas] are yellow',
    ]);
  });

  it('matches every word of the query', () => {
    const matches = sqlSearchEntryContent('apple pie', markers);

    expect(matches.map((match) => match.entryId)).toEqual([
      otherDatabaseEntry.id,
    ]);
  });

  it('ignores property types other than text and content', () => {
    const matches = sqlSearchEntryContent('banana.com', markers);

    expect(matches).toEqual([]);
  });

  it('orders matches by relevance', () => {
    // Replace the banana entry's content with repeated apples
    sqlUpsertEntries(
      objectDatabase.id,
      [
        {
          ...bananaEntry,
          properties: [
            {
              name: 'Content',
              type: 'content',
              value: 'Apple apple apple',
            },
          ],
        },
      ],
      { silent: true },
    );

    const matches = sqlSearchEntryContent('apple', markers);

    expect(matches[0].entryId).toBe(bananaEntry.id);
  });

  it('limits matches to the given database', () => {
    const matches = sqlSearchEntryContent('apple', {
      ...markers,
      databaseId: urlDatabase.id,
    });

    expect(matches.map((match) => match.entryId)).toEqual([
      otherDatabaseEntry.id,
    ]);
  });

  it('returns at most the given number of matches', () => {
    const matches = sqlSearchEntryContent('apple', { ...markers, limit: 1 });

    expect(matches).toHaveLength(1);
  });

  it('matches the latest value of an updated entry', () => {
    // Replace the apple entry's content
    sqlUpsertEntries(
      objectDatabase.id,
      [
        {
          ...appleEntry,
          properties: [
            { name: 'Content', type: 'content', value: 'A pear a day' },
          ],
        },
      ],
      { silent: true },
    );

    expect(sqlSearchEntryContent('apple', markers)).toHaveLength(1);
    expect(sqlSearchEntryContent('pear', markers)).toHaveLength(1);
  });

  it('drops the content of deleted entries', () => {
    // Delete the banana entry
    sqlDeleteEntries(objectDatabase.id, [bananaEntry.id], { silent: true });

    // Recreate the entry under the same ID without the content, so a
    // leftover index row would match it again.
    sqlUpsertEntries(objectDatabase.id, [{ ...bananaEntry, properties: [] }], {
      silent: true,
    });

    expect(sqlSearchEntryContent('yellow', markers)).toEqual([]);
  });

  it('follows property renames', () => {
    // Rename the Notes property
    sqlRenameProperty(objectDatabase.id, 'Notes', 'Remarks');

    const matches = sqlSearchEntryContent('yellow', markers);

    expect(matches.map((match) => match.propertyName)).toEqual(['Remarks']);
  });

  it('indexes a value whose property becomes a text property', () => {
    // Change the apple entry's URL property to a text property
    Sql.run(
      workspace_1.id,
      "UPDATE entry_properties SET property_type = 'text' WHERE entry_id = ? AND property_name = 'Source'",
      appleEntry.id,
    );

    const matches = sqlSearchEntryContent('banana.com', markers);

    expect(matches.map((match) => match.entryId)).toEqual([appleEntry.id]);
  });

  it('drops a value whose property stops being a text property', () => {
    // Change the banana entry's text property to a URL property
    Sql.run(
      workspace_1.id,
      "UPDATE entry_properties SET property_type = 'url' WHERE entry_id = ? AND property_name = 'Notes'",
      bananaEntry.id,
    );

    expect(sqlSearchEntryContent('yellow', markers)).toEqual([]);
  });

  it('reads FTS5 operators in the query as words to match', () => {
    // As operators, these would match the apple entry
    expect(sqlSearchEntryContent('apple AND day', markers)).toEqual([]);
    expect(sqlSearchEntryContent('day NOT (pear)', markers)).toEqual([]);
  });

  it('reads quotes in the query as text', () => {
    const matches = sqlSearchEntryContent('"day', markers);

    expect(matches.map((match) => match.entryId)).toEqual([appleEntry.id]);
  });

  it('returns nothing for a query without words', () => {
    expect(sqlSearchEntryContent('  ', markers)).toEqual([]);
  });
});
