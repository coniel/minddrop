import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SpacesStore } from '../../SpacesStore';
import { cleanup, setup, space_1 } from '../../test-utils';
import { Space } from '../../types';
import { getRecentSpaces } from './getRecentSpaces';

// Spaces with distinct creation dates, newer than the ones
// the fixtures carry.
const middleSpace: Space = {
  ...space_1,
  id: 'space_middle',
  created: new Date('2026-02-01T00:00:00.000Z'),
};
const newestSpace: Space = {
  ...space_1,
  id: 'space_newest',
  created: new Date('2026-03-01T00:00:00.000Z'),
};

describe('getRecentSpaces', () => {
  beforeEach(() => {
    setup();

    // Load extra spaces with distinct creation dates
    SpacesStore.load([middleSpace, newestSpace]);
  });

  afterEach(cleanup);

  it('sorts the spaces by creation date, newest first', () => {
    expect(getRecentSpaces(2)).toEqual([newestSpace, middleSpace]);
  });

  it('returns no more spaces than the limit', () => {
    expect(getRecentSpaces(1)).toEqual([newestSpace]);
  });
});
