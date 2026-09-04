import { describe, expect, it } from 'vitest';
import { coverDesignElement, iconDesignElement } from '../../test-utils';
import { DesignElement } from '../../types';
import { resolveScalingRows } from './resolveScalingRows';

// A fluid-height cover across rows 0-15
const fluidCover: DesignElement = {
  ...coverDesignElement,
  heightMode: 'fluid',
};

// A top-pinned element in rows 0-5
const topElement: DesignElement = {
  ...iconDesignElement,
  column: 0,
  columnSpan: 48,
  row: 0,
  rowSpan: 6,
  heightMode: 'fixed-top',
};

describe('resolveScalingRows', () => {
  it('scales a fluid-height element across its own rows', () => {
    const scaling = resolveScalingRows([fluidCover], 32);

    // Cover rows 0-15 scale, the gap below stays fixed
    expect(scaling[0]).toBe(true);
    expect(scaling[15]).toBe(true);
    expect(scaling[16]).toBe(false);
  });

  it('keeps every gap fixed when a fluid-height element is present', () => {
    // A top-pinned element below the fluid cover
    const pinned: DesignElement = {
      ...topElement,
      id: 'element_pinned',
      row: 20,
    };
    const scaling = resolveScalingRows([fluidCover, pinned], 32);

    expect(scaling.filter(Boolean)).toHaveLength(fluidCover.rowSpan);
    expect(scaling[18]).toBe(false);
    expect(scaling[30]).toBe(false);
  });

  it('scales the gap below a top-pinned element as a fallback', () => {
    const scaling = resolveScalingRows([topElement], 32);

    expect(scaling[0]).toBe(false);
    expect(scaling[5]).toBe(false);
    expect(scaling[6]).toBe(true);
    expect(scaling[31]).toBe(true);
  });

  it('scales the gap above a bottom-pinned element as a fallback', () => {
    const scaling = resolveScalingRows(
      [{ ...topElement, row: 26, heightMode: 'fixed-bottom' }],
      32,
    );

    expect(scaling[0]).toBe(true);
    expect(scaling[25]).toBe(true);
    expect(scaling[26]).toBe(false);
  });

  it('scales both gaps of a centered element as a fallback', () => {
    const scaling = resolveScalingRows(
      [{ ...topElement, row: 13, heightMode: 'fixed-center' }],
      32,
    );

    expect(scaling[12]).toBe(true);
    expect(scaling[13]).toBe(false);
    expect(scaling[18]).toBe(false);
    expect(scaling[19]).toBe(true);
  });

  it('keeps the gap between consecutive top-pinned elements fixed', () => {
    // A second top-pinned element two units below the first
    const secondElement: DesignElement = {
      ...topElement,
      id: 'element_second',
      row: 8,
    };
    const scaling = resolveScalingRows([topElement, secondElement], 32);

    // The gap inside the chain stays fixed, the gap past it absorbs
    expect(scaling[6]).toBe(false);
    expect(scaling[7]).toBe(false);
    expect(scaling[14]).toBe(true);
    expect(scaling[31]).toBe(true);
  });

  it('treats elements without a height mode as fluid', () => {
    const scaling = resolveScalingRows([coverDesignElement], 32);

    expect(scaling[0]).toBe(true);
    expect(scaling[15]).toBe(true);
  });
});
