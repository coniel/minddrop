import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  ownedCardDesign_1,
  ownedListDesign_1,
  setup,
} from '../test-utils';
import { getOwnedDesigns } from './getOwnedDesigns';

describe('getOwnedDesigns', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("returns the owner's designs", () => {
    expect(getOwnedDesigns('database_1')).toEqual([
      ownedCardDesign_1,
      ownedListDesign_1,
    ]);
  });

  it('returns an empty array when the owner has no designs', () => {
    expect(getOwnedDesigns('database_missing')).toEqual([]);
  });
});
