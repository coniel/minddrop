import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  DatabaseEntryTemplateNotFoundError,
  DatabaseNotFoundError,
} from '../errors';
import {
  cleanup,
  entryTemplate1,
  entryTemplatesDatabase,
  setup,
} from '../test-utils';
import { getDatabaseEntryTemplate } from './getDatabaseEntryTemplate';

describe('getDatabaseEntryTemplate', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the requested template', () => {
    expect(
      getDatabaseEntryTemplate(entryTemplatesDatabase.id, entryTemplate1.id),
    ).toEqual(entryTemplate1);
  });

  it('throws if the database does not exist', () => {
    expect(() =>
      getDatabaseEntryTemplate('missing', entryTemplate1.id),
    ).toThrow(DatabaseNotFoundError);
  });

  it('throws if the template does not exist', () => {
    expect(() =>
      getDatabaseEntryTemplate(entryTemplatesDatabase.id, 'missing'),
    ).toThrow(DatabaseEntryTemplateNotFoundError);
  });
});
