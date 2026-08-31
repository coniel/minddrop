import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, objectDatabase, setup } from '../../test-utils';
import { serializeDatabaseReference } from './serializeDatabaseReference';

describe('serializeDatabaseReference', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("serializes the database ID into the database's name", () => {
    expect(serializeDatabaseReference(objectDatabase.id)).toBe(
      objectDatabase.name,
    );
  });

  it('returns null for IDs that do not resolve', () => {
    expect(serializeDatabaseReference('database_missing')).toBeNull();
  });
});
