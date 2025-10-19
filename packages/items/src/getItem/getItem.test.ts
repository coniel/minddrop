import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemNotFoundError } from '../errors';
import { cleanup, dataItem1, setup } from '../test-utils';
import { getItem } from './getItem';

describe('getItem', () => {
  beforeEach(() => setup({ loadItems: true }));

  afterEach(cleanup);

  it('returns the entry if it exists', () => {
    const entry = getItem(dataItem1.path);

    expect(entry).toEqual(dataItem1);
  });

  it('returns null if the entry does not exist', () => {
    const entry = getItem('non-existent-entry');

    expect(entry).toBeNull();
  });

  it('throws if the entry does not exist and throwOnNotFound is true', () => {
    expect(() => getItem('non-existent-entry', true)).toThrow(
      ItemNotFoundError,
    );
  });
});
