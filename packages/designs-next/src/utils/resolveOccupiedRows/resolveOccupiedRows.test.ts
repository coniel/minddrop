import { describe, expect, it } from 'vitest';
import { coverDesignElement, iconDesignElement } from '../../test-utils';
import { resolveOccupiedRows } from './resolveOccupiedRows';

describe('resolveOccupiedRows', () => {
  it('marks the rows covered by element spans', () => {
    const occupied = resolveOccupiedRows(
      [coverDesignElement, iconDesignElement],
      32,
    );

    // Cover rows 0-15 and icon rows 8-13 are occupied
    expect(occupied[0]).toBe(true);
    expect(occupied[15]).toBe(true);
    expect(occupied[16]).toBe(false);
    expect(occupied[31]).toBe(false);
  });

  it('returns all rows unoccupied without elements', () => {
    expect(resolveOccupiedRows([], 4)).toEqual([false, false, false, false]);
  });
});
