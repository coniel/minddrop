import { describe, expect, it } from 'vitest';
import { formatUnitLength } from './formatUnitLength';

describe('formatUnitLength', () => {
  it('formats fixed units as pixels', () => {
    expect(
      formatUnitLength({ fixed: 2, scaling: 0 }, { fixed: 8, scaling: 40 }),
    ).toBe('8px');
  });

  it('formats every scaling unit of a region with no fixed unit as the full length', () => {
    expect(
      formatUnitLength({ fixed: 0, scaling: 48 }, { fixed: 0, scaling: 48 }),
    ).toBe('100%');
  });

  it('subtracts the fixed units of the region from the scaling length', () => {
    expect(
      formatUnitLength({ fixed: 0, scaling: 28 }, { fixed: 20, scaling: 28 }),
    ).toBe('calc(100% - 80px)');
  });

  it('formats a share of the scaling units as a fraction', () => {
    expect(
      formatUnitLength({ fixed: 0, scaling: 12 }, { fixed: 0, scaling: 48 }),
    ).toBe('calc(100% * 12 / 48)');
  });

  it('formats a share of a reduced scaling length as a fraction', () => {
    expect(
      formatUnitLength({ fixed: 0, scaling: 12 }, { fixed: 8, scaling: 40 }),
    ).toBe('calc((100% - 32px) * 12 / 40)');
  });

  it('adds fixed and scaling units', () => {
    expect(
      formatUnitLength({ fixed: 12, scaling: 28 }, { fixed: 20, scaling: 28 }),
    ).toBe('calc(48px + 100% - 80px)');
  });

  it('formats scaling units as pixels when nothing in the region scales', () => {
    expect(
      formatUnitLength({ fixed: 0, scaling: 0 }, { fixed: 8, scaling: 0 }),
    ).toBe('0px');
  });
});
