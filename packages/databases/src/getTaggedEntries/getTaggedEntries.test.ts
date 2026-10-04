import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabasesStore } from '../DatabasesStore';
import { EntriesStore } from '../EntriesStore';
import {
  cleanup,
  objectDatabase,
  objectEntry1,
  parentDir,
  setup,
} from '../test-utils';
import { getTaggedEntries } from './getTaggedEntries';

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

// An entry referencing a tag
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

describe('getTaggedEntries', () => {
  beforeEach(() => {
    setup();

    // Add the tags database and its entry to the stores
    DatabasesStore.set(tagsDatabase);
    EntriesStore.set(taggedEntry);
  });

  afterEach(cleanup);

  it('retrieves the entries referencing the tag', () => {
    expect(getTaggedEntries('Urgent')).toEqual([taggedEntry]);
  });

  it('returns an empty array when no entry references the tag', () => {
    expect(getTaggedEntries('Unused')).toEqual([]);
  });
});
