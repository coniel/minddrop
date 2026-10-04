import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  entryTemplate1,
  entryTemplatesDatabase,
  objectDatabase,
  setup,
} from '../../test-utils';
import { searchEntryCreationOptions } from './searchEntryCreationOptions';

describe('searchEntryCreationOptions', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('offers a database matched by name', () => {
    const options = searchEntryCreationOptions(objectDatabase.name);

    expect(options[0]).toEqual({ database: objectDatabase });
  });

  it('offers a database matched by its entry name', () => {
    const options = searchEntryCreationOptions(objectDatabase.entryName);

    expect(options[0]).toEqual({ database: objectDatabase });
  });

  it('lists a database matched by both its names once', () => {
    // The entry name matches the database name too, so the
    // database is matched by both of its searchable strings.
    const options = searchEntryCreationOptions(objectDatabase.entryName);

    expect(
      options.filter((result) => result.database.id === objectDatabase.id),
    ).toHaveLength(1);
  });

  it('offers an entry template matched by name', () => {
    const options = searchEntryCreationOptions(entryTemplate1.name);

    expect(options[0]).toEqual({
      database: entryTemplatesDatabase,
      template: entryTemplate1,
    });
  });

  it('ranks databases and templates in one order', () => {
    // Matches the templates database by name and both of its
    // templates by theirs.
    const options = searchEntryCreationOptions('template');

    expect(options.map((result) => result.template?.id)).toContain(
      entryTemplate1.id,
    );
    expect(
      options.some(
        (result) => result.database.id === entryTemplatesDatabase.id,
      ),
    ).toBe(true);
  });

  it('offers nothing when nothing matches', () => {
    expect(searchEntryCreationOptions('nonexistent')).toEqual([]);
  });

  it('ignores databases outside the given IDs', () => {
    const options = searchEntryCreationOptions(entryTemplate1.name, [
      objectDatabase.id,
    ]);

    expect(options).toEqual([]);
  });
});
