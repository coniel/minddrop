import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabasesStore } from '../../DatabasesStore';
import {
  cleanup,
  entryTemplate1,
  entryTemplate2,
  entryTemplatesDatabase,
  objectDatabase,
  setup,
} from '../../test-utils';
import { searchDatabaseEntryTemplates } from './searchDatabaseEntryTemplates';

describe('searchDatabaseEntryTemplates', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('matches templates by name', () => {
    const results = searchDatabaseEntryTemplates(entryTemplate1.name);

    expect(results[0]).toEqual({
      database: entryTemplatesDatabase,
      template: entryTemplate1,
    });
  });

  it('returns no results when nothing matches', () => {
    expect(searchDatabaseEntryTemplates('nonexistent template')).toEqual([]);
  });

  it('ignores databases outside the given IDs', () => {
    expect(
      searchDatabaseEntryTemplates(entryTemplate1.name, [objectDatabase.id]),
    ).toEqual([]);
  });

  it('returns templates from every database sharing a name', () => {
    // Give a second database a template with the same name
    DatabasesStore.update(objectDatabase.id, {
      entryTemplates: [entryTemplate1],
    });

    const results = searchDatabaseEntryTemplates(entryTemplate1.name);

    // Both databases' templates are returned
    expect(results.map((result) => result.database.id).sort()).toEqual(
      [entryTemplatesDatabase.id, objectDatabase.id].sort(),
    );
  });

  it('matches templates in databases with no other matching text', () => {
    const results = searchDatabaseEntryTemplates(entryTemplate2.name);

    expect(results).toHaveLength(1);
    expect(results[0].template).toEqual(entryTemplate2);
  });
});
