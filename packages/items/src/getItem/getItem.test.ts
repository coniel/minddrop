import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemNotFoundError } from '../errors';
import { cleanup, markdownItem1, setup } from '../test-utils';
import { getItem } from './getItem';

describe('getItem', () => {
  beforeEach(() => setup({ loadItems: true }));

  afterEach(cleanup);

  it('returns the entry if it exists', () => {
    const entry = getItem(markdownItem1.path);

    expect(entry).toEqual(markdownItem1);
  });

  it('throws if the entry does not exist and throwOnNotFound is true', () => {
    expect(() => getItem('non-existent-entry')).toThrow(ItemNotFoundError);
  });
});
