import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, collectionEntry1, setup } from '../../test-utils';
import { databaseEntryAddress } from './databaseEntryAddress';

describe('databaseEntryAddress', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('strips the workspace path prefix', () => {
    expect(databaseEntryAddress(collectionEntry1.path)).toBe(
      'Collection Database/Collection Entry 1.md',
    );
  });
});
