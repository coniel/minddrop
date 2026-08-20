import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup, space_2 } from '../../test-utils';
import { searchSpaces } from './searchSpaces';

describe('searchSpaces', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('matches spaces by name', () => {
    expect(searchSpaces('Space 2')).toContain(space_2);
  });

  it('returns an empty array when nothing matches', () => {
    expect(searchSpaces('xyzq')).toEqual([]);
  });
});
