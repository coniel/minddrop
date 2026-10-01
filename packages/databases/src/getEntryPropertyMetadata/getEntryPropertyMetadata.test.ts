import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryNotFoundError } from '../errors';
import { cleanup, objectEntry1, setup } from '../test-utils';
import { getEntryPropertyMetadata } from './getEntryPropertyMetadata';

// The Paper property's metadata
const paperMetadata = { annotations: [{ id: 'a1' }] };

describe('getEntryPropertyMetadata', () => {
  beforeEach(() => {
    setup();

    // Give the entry's Paper property metadata
    DatabaseEntriesStore.update(objectEntry1.id, {
      metadata: { properties: { Paper: paperMetadata } },
    });
  });

  afterEach(cleanup);

  it("returns the property's metadata", () => {
    expect(getEntryPropertyMetadata(objectEntry1.id, 'Paper')).toEqual(
      paperMetadata,
    );
  });

  it('returns empty metadata for a property without any', () => {
    expect(getEntryPropertyMetadata(objectEntry1.id, 'Cover')).toEqual({});
  });

  it('throws if the entry does not exist', () => {
    expect(() => getEntryPropertyMetadata('missing', 'Paper')).toThrow(
      DatabaseEntryNotFoundError,
    );
  });
});
