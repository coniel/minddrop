import { describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '../../test-utils';
import { isSameRegion } from './isSameRegion';

const { titleDesignElement } = DesignElementFixtures;

describe('isSameRegion', () => {
  it('returns true for regions sharing their edges', () => {
    expect(
      isSameRegion(titleDesignElement, {
        column: titleDesignElement.column,
        row: titleDesignElement.row,
        columnSpan: titleDesignElement.columnSpan,
        rowSpan: titleDesignElement.rowSpan,
      }),
    ).toBe(true);
  });

  it('returns false for regions differing on an edge', () => {
    expect(
      isSameRegion(titleDesignElement, {
        ...titleDesignElement,
        rowSpan: titleDesignElement.rowSpan + 1,
      }),
    ).toBe(false);
  });
});
