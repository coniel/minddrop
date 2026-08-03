import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, collectionEntry1, setup } from '../../test-utils';
import { databaseEntryAddress } from '../databaseEntryAddress';
import { databaseEntryPathFromAddress } from './databaseEntryPathFromAddress';

describe('databaseEntryPathFromAddress', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('round-trips with databaseEntryAddress', () => {
    const address = databaseEntryAddress(collectionEntry1.path);

    expect(databaseEntryPathFromAddress(address)).toBe(collectionEntry1.path);
  });
});
