import { describe, expect, it } from 'vitest';
import { iconDesignElement, titleDesignElement } from '../../test-utils';
import { resolveOccupiedColumns } from './resolveOccupiedColumns';

describe('resolveOccupiedColumns', () => {
  it('marks the columns covered by element spans', () => {
    const occupied = resolveOccupiedColumns(
      [titleDesignElement, iconDesignElement],
      48,
    );

    // Title columns 2-29 and icon columns 40-45 are occupied
    expect(occupied[1]).toBe(false);
    expect(occupied[2]).toBe(true);
    expect(occupied[29]).toBe(true);
    expect(occupied[30]).toBe(false);
    expect(occupied[40]).toBe(true);
    expect(occupied[45]).toBe(true);
    expect(occupied[46]).toBe(false);
  });

  it('clamps spans extending past the card bounds', () => {
    const occupied = resolveOccupiedColumns(
      [{ ...iconDesignElement, column: 44, columnSpan: 10 }],
      48,
    );

    expect(occupied).toHaveLength(48);
    expect(occupied[47]).toBe(true);
  });

  it('returns all columns unoccupied without elements', () => {
    expect(resolveOccupiedColumns([], 4)).toEqual([false, false, false, false]);
  });
});
