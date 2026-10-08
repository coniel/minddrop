import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
  timestampEntry1,
  urlDatabase,
} from '../../test-utils';
import { entryMetadataKey } from '../entryMetadataKey';
import { findEntryByMetadataKey } from './findEntryByMetadataKey';

describe('findEntryByMetadataKey', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("finds the entry owning a sidecar by the sidecar's key", () => {
    expect(
      findEntryByMetadataKey(
        objectDatabase.id,
        entryMetadataKey(objectEntry1.path),
      ),
    ).toEqual(objectEntry1);
  });

  it('does not find an entry of another database', () => {
    expect(
      findEntryByMetadataKey(
        urlDatabase.id,
        entryMetadataKey(timestampEntry1.path),
      ),
    ).toBeNull();
  });

  it('returns null for a key no entry owns', () => {
    expect(findEntryByMetadataKey(objectDatabase.id, 'Gone')).toBeNull();
  });
});
