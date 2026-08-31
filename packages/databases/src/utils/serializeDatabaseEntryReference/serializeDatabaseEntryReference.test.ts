import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, objectDatabase, objectEntry1, setup } from '../../test-utils';
import { serializeDatabaseEntryReference } from './serializeDatabaseEntryReference';

describe('serializeDatabaseEntryReference', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("serializes the entry ID into the entry's address", () => {
    expect(serializeDatabaseEntryReference(objectEntry1.id)).toBe(
      `${objectDatabase.name}/${objectEntry1.title}`,
    );
  });

  it('returns null for IDs that do not resolve', () => {
    expect(
      serializeDatabaseEntryReference('database-entry_missing'),
    ).toBeNull();
  });
});
