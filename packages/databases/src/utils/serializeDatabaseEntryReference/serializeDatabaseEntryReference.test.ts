import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, objectEntry1, setup } from '../../test-utils';
import { databaseEntryAddress } from '../databaseEntryAddress';
import { serializeDatabaseEntryReference } from './serializeDatabaseEntryReference';

describe('serializeDatabaseEntryReference', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("serializes the entry ID into the entry's address", () => {
    expect(serializeDatabaseEntryReference(objectEntry1.id)).toBe(
      databaseEntryAddress(objectEntry1.path),
    );
  });

  it('returns null for IDs that do not resolve', () => {
    expect(
      serializeDatabaseEntryReference('database-entry_missing'),
    ).toBeNull();
  });
});
