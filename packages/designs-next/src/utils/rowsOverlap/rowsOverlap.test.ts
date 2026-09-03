import { describe, expect, it } from 'vitest';
import { coverDesignElement, titleDesignElement } from '../../test-utils';
import { rowsOverlap } from './rowsOverlap';

describe('rowsOverlap', () => {
  it('returns true when the elements share rows', () => {
    expect(rowsOverlap(coverDesignElement, titleDesignElement)).toBe(true);
  });

  it('returns false when the elements are in disjoint rows', () => {
    expect(
      rowsOverlap(coverDesignElement, { ...titleDesignElement, row: 20 }),
    ).toBe(false);
  });

  it('returns false when the elements only touch edges', () => {
    expect(
      rowsOverlap(coverDesignElement, {
        ...titleDesignElement,
        row: coverDesignElement.row + coverDesignElement.rowSpan,
      }),
    ).toBe(false);
  });
});
