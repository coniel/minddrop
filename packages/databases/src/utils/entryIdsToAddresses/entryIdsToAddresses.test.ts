import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  collectionEntry1,
  objectEntry1,
  setup,
} from '../../test-utils';
import { databaseEntryAddress } from '../databaseEntryAddress';
import { entryIdsToAddresses } from './entryIdsToAddresses';

describe('entryIdsToAddresses', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('converts entry IDs to addresses, preserving order', () => {
    expect(entryIdsToAddresses([collectionEntry1.id, objectEntry1.id])).toEqual(
      [
        databaseEntryAddress(collectionEntry1.path),
        databaseEntryAddress(objectEntry1.path),
      ],
    );
  });

  it('drops IDs that do not resolve', () => {
    expect(entryIdsToAddresses(['missing-entry', objectEntry1.id])).toEqual([
      databaseEntryAddress(objectEntry1.path),
    ]);
  });
});
