import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  collectionEntry1,
  objectEntry1,
  setup,
} from '../../test-utils';
import { databaseEntryAddress } from '../databaseEntryAddress';
import { addressesToEntryIds } from './addressesToEntryIds';

describe('addressesToEntryIds', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('resolves addresses to entry IDs, preserving order', () => {
    expect(
      addressesToEntryIds([
        databaseEntryAddress(collectionEntry1.path),
        databaseEntryAddress(objectEntry1.path),
      ]),
    ).toEqual([collectionEntry1.id, objectEntry1.id]);
  });

  it('drops addresses that do not resolve', () => {
    expect(
      addressesToEntryIds([
        'Missing Database/Missing Entry.md',
        databaseEntryAddress(objectEntry1.path),
      ]),
    ).toEqual([objectEntry1.id]);
  });
});
