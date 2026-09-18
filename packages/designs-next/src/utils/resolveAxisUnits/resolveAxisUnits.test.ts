import { describe, expect, it } from 'vitest';
import { resolveAxisUnits } from './resolveAxisUnits';

// Two fixed units, four scaling units, two fixed units
const scaling = [false, false, true, true, true, true, false, false];

describe('resolveAxisUnits', () => {
  it('splits the units before the extent by whether they scale', () => {
    expect(resolveAxisUnits(scaling, 4, 2).before).toEqual({
      fixed: 2,
      scaling: 2,
    });
  });

  it('splits the units the extent spans by whether they scale', () => {
    expect(resolveAxisUnits(scaling, 4, 3).span).toEqual({
      fixed: 1,
      scaling: 2,
    });
  });

  it('splits the units of the whole region by whether they scale', () => {
    expect(resolveAxisUnits(scaling, 4, 3).total).toEqual({
      fixed: 4,
      scaling: 4,
    });
  });

  it('counts nothing before an extent at the region start', () => {
    expect(resolveAxisUnits(scaling, 0, 2).before).toEqual({
      fixed: 0,
      scaling: 0,
    });
  });
});
