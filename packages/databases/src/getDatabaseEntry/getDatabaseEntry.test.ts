import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntryNotFoundError } from '../errors';
import { cleanup, objectEntry1, setup } from '../test-utils';
import { getDatabaseEntry } from './getDatabaseEntry';

describe('getDatabaseEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the entry if it exists', () => {
    const entry = getDatabaseEntry(objectEntry1.id);

    expect(entry).toEqual(objectEntry1);
  });

  it('throws if the entry does not exist and throwOnNotFound is true', () => {
    expect(() => getDatabaseEntry('non-existent-entry')).toThrow(
      DatabaseEntryNotFoundError,
    );
  });

  it('returns null if the entry does not exist and throwOnNotFound is false', () => {
    const entry = getDatabaseEntry('non-existent-entry', false);

    expect(entry).toBeNull();
  });
});
